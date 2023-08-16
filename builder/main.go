package main

import (
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type ModTimer interface {
	ModTime() time.Time
}

func CreateOutput(path string, conf ConvertConfig) (*os.File, error) {
	log.Println("Create", path)
	os.MkdirAll(filepath.Join(conf.Destination, filepath.Dir(path)), 0755)
	return os.Create(filepath.Join(conf.Destination, path))
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
