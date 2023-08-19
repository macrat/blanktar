package main

import (
	"io"

	"github.com/tdewolff/minify/v2"
	"github.com/tdewolff/minify/v2/css"
	"github.com/tdewolff/minify/v2/html"
	"github.com/tdewolff/minify/v2/js"
	"github.com/tdewolff/minify/v2/json"
	"github.com/tdewolff/minify/v2/svg"
	"github.com/tdewolff/minify/v2/xml"
)

func MinifyWriter(mimetype string, w io.Writer) io.WriteCloser {
	types := map[string]minify.MinifierFunc{
		"text/html":           html.Minify,
		"text/css":            css.Minify,
		"text/javascript":     js.Minify,
		"application/json":    json.Minify,
		"application/ld+json": json.Minify,
		"image/svg+xml":       svg.Minify,
		"text/xml":            xml.Minify,
		"application/xml":     xml.Minify,
	}

	if _, ok := types[mimetype]; !ok {
		return NopWriteCloser{w}
	}

	m := minify.New()
	for k, v := range types {
		m.AddFunc(k, v)
	}

	return m.Writer(mimetype, w)
}

type NopWriteCloser struct {
	io.Writer
}

func (w NopWriteCloser) Write(p []byte) (int, error) {
	return w.Writer.Write(p)
}

func (w NopWriteCloser) Close() error {
	return nil
}
