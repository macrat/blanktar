package main

import (
	"path"
	"path/filepath"

	"github.com/macrat/blanktar/builder/thumbnail"
)

type ThumbnailGenerator struct {
	generator thumbnail.Generator
}

func NewThumbnailGenerator(regularFontPath, semiBoldFontPath string) (ThumbnailGenerator, error) {
	generator, err := thumbnail.NewGenerator(regularFontPath, semiBoldFontPath)
	return ThumbnailGenerator{generator}, err
}

func (g ThumbnailGenerator) Hook(articlePath string, article Article, conf ConvertConfig) error {
	outputPath := path.Join("images", articlePath[:len(articlePath)-len(filepath.Ext(articlePath))]+".png")

	if !NeedToUpdate(outputPath, article.SourceInfo, conf) {
		return nil
	}

	w, err := CreateOutput(outputPath, conf, "image/png")
	if err != nil {
		return err
	}
	defer w.Close()

	return g.generator.Generate(w, article.Title, article.Tags)
}
