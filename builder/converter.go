package main

import (
	"errors"
	"io"
	"os"
	"path/filepath"
)

var (
	ErrUnsupportedFormat = errors.New("unsupported format")
)

type ConvertConfig struct {
	Destination  string
	Source       string
	PostsPerPage int
}

type Converter interface {
	Convert(source string, info os.FileInfo, conf ConvertConfig) error
}

type ConverterSet []Converter

func (c ConverterSet) Convert(source string, info os.FileInfo, conf ConvertConfig) error {
	for _, converter := range c {
		err := converter.Convert(source, info, conf)
		if !errors.Is(err, ErrUnsupportedFormat) {
			return err
		}
	}
	return ErrUnsupportedFormat
}

type CopyConverter struct {
}

func (c CopyConverter) Convert(source string, info os.FileInfo, conf ConvertConfig) error {
	if !NeedToUpdate(source, info, conf) {
		return nil
	}

	input, err := os.Open(filepath.Join(conf.Source, source))
	if err != nil {
		return err
	}
	defer input.Close()

	output, err := CreateOutput(source, conf, "")
	if err != nil {
		return err
	}
	defer output.Close()

	_, err = io.Copy(output, input)
	return err
}
