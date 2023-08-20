package main

import (
	"path"
	"path/filepath"

	"github.com/macrat/blanktar/builder/fs"
	"github.com/macrat/blanktar/builder/thumbnail"
)

type ThumbnailGenerator struct {
	generator thumbnail.Generator
}

func NewThumbnailGenerator(regularFontPath, semiBoldFontPath string) (ThumbnailGenerator, error) {
	generator, err := thumbnail.NewGenerator(regularFontPath, semiBoldFontPath)
	return ThumbnailGenerator{generator}, err
}

func (g ThumbnailGenerator) Hook(ctx ConvertContext, articlePath string, article Article) error {
	outputPath := path.Join("images", articlePath[:len(articlePath)-len(filepath.Ext(articlePath))]+".png")

	if fs.ModTime(ctx.Dest, outputPath).After(fs.ModTime(ctx.Source, articlePath)) {
		return nil
	}

	w, err := CreateOutput(ctx.Dest, outputPath, "image/png")
	if err != nil {
		return err
	}
	defer w.Close()

	return g.generator.Generate(w, article.Title, article.Tags)
}
