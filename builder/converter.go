package main

import (
	"errors"
	"io"
	"strings"

	"github.com/macrat/blanktar/builder/fs"
)

var (
	ErrUnsupportedFormat = errors.New("unsupported format")
)

type ConvertContext struct {
	Dest         fs.Writable
	Source       fs.Readable
	PostsPerPage int
}

type Converter interface {
	Convert(ctx ConvertContext, sourcePath string) error
}

type ConverterSet []Converter

func (c ConverterSet) Convert(ctx ConvertContext, sourcePath string) error {
	for _, converter := range c {
		err := converter.Convert(ctx, sourcePath)
		if !errors.Is(err, ErrUnsupportedFormat) {
			return err
		}
	}
	return ErrUnsupportedFormat
}

type CopyConverter struct{}

func (c CopyConverter) Convert(ctx ConvertContext, sourcePath string) error {
	return Copy(ctx, sourcePath, "")
}

type SVGConverter struct{}

func (c SVGConverter) Convert(ctx ConvertContext, sourcePath string) error {
	if !strings.HasSuffix(sourcePath, ".svg") {
		return ErrUnsupportedFormat
	}

	return Copy(ctx, sourcePath, "image/svg+xml")
}

func Copy(ctx ConvertContext, path, mimeType string) error {
	if fs.ModTime(ctx.Dest, path).After(fs.ModTime(ctx.Source, path)) {
		return nil
	}

	input, err := ctx.Source.Open(path)
	if err != nil {
		return err
	}
	defer input.Close()

	output, err := CreateOutput(ctx.Dest, path, mimeType)
	if err != nil {
		return err
	}
	defer output.Close()

	_, err = io.Copy(output, input)
	return err
}
