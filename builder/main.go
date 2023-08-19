package main

import (
	"errors"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/fsnotify/fsnotify"
)

type ModTimer interface {
	ModTime() time.Time
}

type OutputWriter struct {
	f *os.File
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

func CreateOutput(path string, conf ConvertConfig, mimetype string) (io.WriteCloser, error) {
	log.Println("Generate", path)

	os.MkdirAll(filepath.Join(conf.Destination, filepath.Dir(path)), 0755)
	f, err := os.Create(filepath.Join(conf.Destination, path))
	if err != nil {
		return nil, err
	}

	if mimetype == "" {
		return f, nil
	}

	m := MinifyWriter(mimetype, f)
	return &OutputWriter{f, m}, nil
}

func NeedToUpdate[T ModTimer](targetPath string, sourceInfo T, conf ConvertConfig) bool {
	target, err := os.Stat(filepath.Join(conf.Destination, targetPath))

	return err != nil || target.ModTime().Compare(sourceInfo.ModTime()) <= 0
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

func StartWatching(conf ConvertConfig, converter Converter, autoindex *IndexGenerator) error {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return err
	}

	err = filepath.Walk(conf.Source, func(fpath string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() && !strings.HasPrefix(info.Name(), ".") {
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

					info, err := os.Stat(event.Name)
					if err != nil {
						continue
					}
					path, err := filepath.Rel(conf.Source, event.Name)
					if err != nil {
						continue
					}

					err = converter.Convert(path, info, conf)
					if err != nil {
						log.Printf("Failed to update: %s: %s", event.Name, err)
					}
					err = autoindex.Generate(conf)
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

func PreviewServer(conf ConvertConfig) error {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(conf.Destination, r.URL.Path)

		stat, err := os.Stat(path)
		if errors.Is(err, os.ErrNotExist) {
			path += ".html"
			stat, err = os.Stat(path)
			if errors.Is(err, os.ErrNotExist) {
				http.NotFound(w, r)
				return
			} else if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		if stat.IsDir() {
			path = filepath.Join(path, "index.html")
		}

		http.ServeFile(w, r, path)
	})
	log.Println("Listening on :3000")
	return http.ListenAndServe(":3000", nil)
}

func main() {
	conf := ConvertConfig{
		Destination:  "../dist",
		Source:       "../pages",
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

	err = filepath.Walk(conf.Source, func(fpath string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() || strings.HasPrefix(info.Name(), ".") {
			return nil
		}

		path, err := filepath.Rel(conf.Source, fpath)
		if err != nil {
			return err
		}

		err = converter.Convert(path, info, conf)
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

	err = indexGenerator.Generate(conf)
	if err != nil {
		log.Fatal(err)
	}

	if len(os.Args) > 1 && os.Args[1] == "preview" {
		if err = StartWatching(conf, converter, indexGenerator); err != nil {
			log.Fatal(err)
		}
		log.Fatal(PreviewServer(conf))
	}
}
