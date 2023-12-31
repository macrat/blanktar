// markdown is a simple wrapper of Goldmark.
// It simplifies the usage of Goldmark.
package markdown

import (
	"io"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/renderer/html"
)

// Option is an alias of goldmark.Option.
type Option = goldmark.Option

// Converter provides conversion from Markdown to HTML.
// It is a simple wrapper of goldmark.Markdown.
type Converter struct {
	md goldmark.Markdown
}

// NewConverter creates a new Converter.
func NewConverter(opts ...Option) *Converter {
	return &Converter{
		md: goldmark.New(append(
			opts,
			goldmark.WithRendererOptions(html.WithUnsafe()),
			goldmark.WithExtensions(
				extension.GFM,
			),
		)...),
	}
}

// Convert converts Markdown to HTML.
func (c *Converter) Convert(w io.Writer, src []byte) error {
	return c.md.Convert(src, w)
}
