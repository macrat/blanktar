package main

import (
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"
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
	log.Println("Create", path)

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

	indexGenerator := NewIndexGenerator(template)

	mdConverter, err := NewArticleConverter(template, indexGenerator.Hook)
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
			log.Printf("%s: %s", err, path)
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
}
