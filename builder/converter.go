package main

import (
	"errors"
	"io"
	"path"
	"strings"

	"github.com/macrat/blanktar/builder/fs"
)

var (
	ErrUnsupportedFormat = errors.New("unsupported format")
)

// Converter converts a single source to one or more artifacts.
type Converter interface {
	Convert(fs.Writable, Source, Config) (ArtifactList, error)
}

// ConverterSet is a converter that converts by one of the converters.
type ConverterSet []Converter

func (c ConverterSet) Convert(dst fs.Writable, src Source, conf Config) (ArtifactList, error) {
	for _, converter := range c {
		as, err := converter.Convert(dst, src, conf)
		if errors.Is(err, ErrUnsupportedFormat) {
			continue
		}
		return as, err
	}
	return nil, ErrUnsupportedFormat
}

type CopyConverter struct{}

func (c CopyConverter) Convert(dst fs.Writable, src Source, conf Config) (ArtifactList, error) {
	return Copy(dst, src, "")
}

type MinifyConverter struct {
	Extension string
	MIMEType  string
}

func NewMinifyConverter(extension, mimeType string) MinifyConverter {
	return MinifyConverter{
		Extension: extension,
		MIMEType:  mimeType,
	}
}

func (c MinifyConverter) Convert(dst fs.Writable, src Source, conf Config) (ArtifactList, error) {
	if !strings.HasSuffix(src.Name(), c.Extension) {
		return nil, ErrUnsupportedFormat
	}

	return Copy(dst, src, c.MIMEType)
}

func Copy(dst fs.Writable, src Source, mimeType string) (ArtifactList, error) {
	dstPath := path.Join("static", src.Name())
	as := ArtifactList{Asset{
		name:   dstPath,
		source: src,
	}}

	if fs.ModTime(dst, dstPath).After(src.ModTime()) {
		return as, nil
	}

	input, err := src.Open()
	if err != nil {
		return nil, err
	}
	defer input.Close()

	output, err := CreateOutput(dst, dstPath, mimeType)
	if err != nil {
		return nil, err
	}
	defer output.Close()

	_, err = io.Copy(output, input)
	return as, err
}
