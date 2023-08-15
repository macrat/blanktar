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

func MinifyWriter(w io.Writer) io.WriteCloser {
	m := minify.New()
	m.AddFunc("text/html", html.Minify)
	m.AddFunc("text/css", css.Minify)
	m.AddFunc("text/javascript", js.Minify)
	m.AddFunc("application/json", json.Minify)
	m.AddFunc("image/svg+xml", svg.Minify)
	m.AddFunc("text/xml", xml.Minify)
	return m.Writer("text/html", w)
}
