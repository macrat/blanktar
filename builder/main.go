package main

import (
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/fsnotify/fsnotify"
	"github.com/macrat/blanktar/builder/fs"
)

type ModTimer interface {
	ModTime() time.Time
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

func StartWatching(ctx ConvertContext, basepath string, converter Converter, autoindex *IndexGenerator) error {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return err
	}

	err = filepath.WalkDir(basepath, func(fpath string, d fs.DirEntry, err error) error {
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
				if event.Has(fsnotify.Write) {
					if filepath.Base(event.Name)[0] == '.' {
						continue
					}

					path, err := filepath.Rel(basepath, event.Name)
					if err != nil {
						continue
					}

					err = converter.Convert(ctx, path)
					if err != nil {
						log.Printf("Failed to update: %s: %s", event.Name, err)
					}

					err = autoindex.Generate(ctx)
					if err != nil {
						log.Printf("Failed to update: autoindex: %s", err)
					}
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

func PreviewServer(ctx ConvertContext) error {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" && strings.HasSuffix(r.URL.Path, "/") {
			http.Redirect(w, r, r.URL.Path[:len(r.URL.Path)-1], http.StatusFound)
			return
		}

		path := r.URL.Path[1:]

		stat, err := fs.Stat(ctx.Dest, path)
		if err == nil && stat.IsDir() {
			path = filepath.Join(path, "index.html")
		}

		f, err := ctx.Dest.Open(path)
		if err != nil {
			http.NotFound(w, r)
			return
		}
		defer f.Close()

		http.ServeContent(w, r, path, fs.ModTime(ctx.Dest, path), f.(io.ReadSeeker))
	})

	log.Println("Listening on :3000")
	return http.ListenAndServe(":3000", nil)
}

func main() {
	stopProfiler := startProfiler()
	defer stopProfiler()

	preview := len(os.Args) > 1 && os.Args[1] == "preview"

	sourceDir := "../pages"
	var dest fs.Writable = fs.NewOnDisk("../dist")

	if preview {
		dest = fs.NewInMemory()
	}

	ctx := ConvertContext{
		Dest:         dest,
		Source:       fs.NewOnDisk(sourceDir),
		PostsPerPage: 10,
	}

	template, err := NewTemplateLoader("../templates")
	if err != nil {
		log.Fatal(err)
	}

	thumbnailGenerator, err := NewThumbnailGenerator("../assets/kokuri-font/regular.ttf", "../assets/kokuri-font/semibold.ttf")
	if err != nil {
		log.Fatal(err)
	}

	indexGenerator := NewIndexGenerator(template)

	mdConverter, err := NewArticleConverter(template, thumbnailGenerator.Hook, indexGenerator.Hook)
	if err != nil {
		log.Fatal(err)
	}

	converter := ConverterSet{
		mdConverter,
		SVGConverter{},
		CopyConverter{},
	}

	var errorCount int

	err = fs.WalkDir(ctx.Source, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() || strings.HasPrefix(d.Name(), ".") {
			return nil
		}

		err = converter.Convert(ctx, path)
		if err != nil {
			log.Printf("Error  %s\n%s", path, err)
			errorCount++
		}

		return nil
	})
	if err != nil {
		log.Fatal(err)
	}
	if errorCount > 0 {
		log.Fatal("Error occurred during build.")
	}

	err = indexGenerator.Generate(ctx)
	if err != nil {
		log.Fatal(err)
	}

	if len(os.Args) > 1 && os.Args[1] == "preview" {
		if err = StartWatching(ctx, sourceDir, converter, indexGenerator); err != nil {
			log.Fatal(err)
		}
		log.Fatal(PreviewServer(ctx))
	}
}
