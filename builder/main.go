package main

import (
	"errors"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"sync"

	"github.com/fsnotify/fsnotify"
	"github.com/macrat/blanktar/builder/fs"
)

type Config struct {
	PostsPerPage int
}

type OutputWriter struct {
	f io.WriteCloser
	m io.WriteCloser
}

func (w OutputWriter) Write(p []byte) (n int, err error) {
	return w.m.Write(p)
}

func (w OutputWriter) Close() error {
	if err := w.m.Close(); err != nil {
		w.f.Close()
		return err
	}
	return w.f.Close()
}

func CreateOutput(dst fs.Writable, path string, mimetype string) (io.WriteCloser, error) {
	log.Println("Generate", path)

	f, err := dst.Create(path)
	if err != nil {
		return nil, err
	}

	if mimetype == "" {
		return f, nil
	}

	m := MinifyWriter(mimetype, f)
	return &OutputWriter{f, m}, nil
}

func EscapeTag(s string) string {
	rules := []struct {
		From string
		To   string
	}{
		{"/", "-"},
		{"?", "-"},
		{"#", "-"},
	}
	for _, rule := range rules {
		s = strings.ReplaceAll(s, rule.From, rule.To)
	}
	for s[0] == '.' {
		s = s[1:]
	}
	return s
}

func PreviewServer(fs_ fs.Readable) error {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" && strings.HasSuffix(r.URL.Path, "/") {
			http.Redirect(w, r, r.URL.Path[:len(r.URL.Path)-1], http.StatusFound)
			return
		}

		path := r.URL.Path[1:]

		stat, err := fs.Stat(fs_, path)
		if err == nil && stat.IsDir() {
			path = filepath.Join(path, "index.html")
		}

		f, err := fs_.Open(path)
		if err != nil {
			http.NotFound(w, r)
			return
		}
		defer f.Close()

		http.ServeContent(w, r, path, fs.ModTime(fs_, path), f.(io.ReadSeeker))
	})

	log.Println("Listening on :3000")
	return http.ListenAndServe(":3000", nil)
}

type ContinuousBuilder struct {
	sync.Mutex

	Src  fs.Readable
	Dst  fs.Writable
	Conf Config

	Converter Converter
	Generator Generator

	converted ArtifactList
	generated ArtifactList
}

func (b *ContinuousBuilder) Builder(ch <-chan Source, errs chan<- error) {
	for s := range ch {
		as, err := b.Converter.Convert(b.Dst, s, b.Conf)
		if err != nil {
			errs <- err
			continue
		}

		b.Lock()
		b.converted.Merge(as)
		b.Unlock()
	}
}

func (b *ContinuousBuilder) Build() error {
	var errs []error
	errsCh := make(chan error)
	go func(errsCh <-chan error) {
		for err := range errsCh {
			errs = append(errs, err)
		}
	}(errsCh)

	var wg sync.WaitGroup
	ch := make(chan Source, runtime.GOMAXPROCS(0))
	for i := 0; i < runtime.GOMAXPROCS(0); i++ {
		wg.Add(1)
		go func() {
			b.Builder(ch, errsCh)
			wg.Done()
		}()
	}

	err := WalkSources(b.Src, func(s Source) error {
		ch <- s
		return nil
	})
	if err != nil {
		return err
	}

	close(ch)
	wg.Wait()
	close(errsCh)

	if len(errs) > 0 {
		return errors.Join(errs...)
	}

	if as, err := b.Generator.Generate(b.Dst, b.converted, b.Conf); err == nil {
		b.generated.Merge(as)
	} else {
		return err
	}

	return nil
}

func (b *ContinuousBuilder) Update(sourceName string) error {
	for _, xs := range []*ArtifactList{&b.converted, &b.generated} {
		for i := 0; i < len(*xs); i++ {
			x := (*xs)[i]
			if x.Sources().Includes(sourceName) {
				b.Dst.Remove(x.Name())
				*xs = append((*xs)[:i], (*xs)[i+1:]...)
				i--
			}
		}
	}
	return b.Build()
}

func (b *ContinuousBuilder) StartWatching(sourceDir string) error {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return err
	}

	err = filepath.WalkDir(sourceDir, func(fpath string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() && !strings.HasPrefix(d.Name(), ".") {
			err = watcher.Add(fpath)
		}
		return err
	})
	if err != nil {
		return err
	}

	go func() {
		for {
			select {
			case event := <-watcher.Events:
				if filepath.Base(event.Name)[0] == '.' || strings.HasSuffix(event.Name, "~") {
					continue
				}

				if event.Op&(fsnotify.Write|fsnotify.Create|fsnotify.Remove) != 0 {
					path, err := filepath.Rel(sourceDir, event.Name)
					if err != nil {
						continue
					}

					log.Println("Update:", path)
					b.Update(path)
				}

				if event.Has(fsnotify.Create) {
					info, err := os.Stat(event.Name)
					if err == nil && info.IsDir() {
						watcher.Add(event.Name)
					}
				}
			case err := <-watcher.Errors:
				log.Println("Error:", err)
			}
		}
	}()

	return nil
}

func serve(path string) {
	http.Handle("/", http.FileServer(http.Dir(path)))
	log.Println("Listening on :3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}

func main() {
	stopProfiler := startProfiler()
	defer stopProfiler()

	preview := len(os.Args) > 1 && os.Args[1] == "preview"

	if len(os.Args) > 1 && os.Args[1] == "serve" {
		serve("../dist")
	}

	sourceDir := "../pages"
	src := fs.NewOnDisk(sourceDir)
	var dst fs.Writable = fs.NewOnDisk("../dist")

	if preview {
		dst = fs.NewInMemory()
	}

	conf := Config{
		PostsPerPage: 10,
	}

	template, err := NewTemplateLoader("../templates")
	if err != nil {
		log.Fatal(err)
	}

	mdConverter, err := NewArticleConverter(template, "../assets/kokuri-font/regular.ttf", "../assets/kokuri-font/semibold.ttf")
	if err != nil {
		log.Fatal(err)
	}

	builder := ContinuousBuilder{
		Src:  src,
		Dst:  dst,
		Conf: conf,
		Converter: ConverterSet{
			mdConverter,
			SVGConverter{},
			PhotoConverter{},
			CopyConverter{},
		},
		Generator: GeneratorSet{
			IndexGenerator{template},
			PhotoGenerator{template},
		},
	}

	if err := builder.Build(); err != nil {
		log.Fatal(err)
	}

	if len(os.Args) > 1 && os.Args[1] == "preview" {
		if err = builder.StartWatching(sourceDir); err != nil {
			log.Fatal(err)
		}
		log.Fatal(PreviewServer(dst))
	}
}