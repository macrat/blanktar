package main

import (
	"bytes"
	"io"
	"strings"

	"github.com/tdewolff/minify/v2"
	"github.com/tdewolff/minify/v2/css"
	mhtml "github.com/tdewolff/minify/v2/html"
	"github.com/tdewolff/minify/v2/js"
	"github.com/tdewolff/minify/v2/json"
	"github.com/tdewolff/minify/v2/svg"
	"github.com/tdewolff/minify/v2/xml"
	"golang.org/x/net/html"
	"golang.org/x/net/html/atom"
)

var (
	Minifier      = minify.New()
	MinifierFuncs = map[string]minify.MinifierFunc{
		"text/html":              mhtml.Minify,
		"text/css":               css.Minify,
		"text/javascript":        js.Minify,
		"application/javascript": js.Minify,
		"application/json":       json.Minify,
		"application/ld+json":    json.Minify,
		"image/svg+xml":          svg.Minify,
		"text/xml":               xml.Minify,
		"application/xml":        xml.Minify,
	}
)

func init() {
	for k, v := range MinifierFuncs {
		Minifier.AddFunc(k, v)
	}
}

func MinifyWriter(mimetype string, w io.Writer) io.WriteCloser {
	if _, ok := MinifierFuncs[mimetype]; !ok {
		return NopWriteCloser{w}
	}

	if mimetype == "text/html" {
		return &HTMLMinifier{w: Minifier.Writer(mimetype, w)}
	}

	return Minifier.Writer(mimetype, w)
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

type HTMLMinifier struct {
	w   io.WriteCloser
	buf bytes.Buffer
}

func (w *HTMLMinifier) Write(p []byte) (int, error) {
	return w.buf.Write(p)
}

func (w *HTMLMinifier) Close() error {
	if err := HoistingHTML(w.w, &w.buf); err != nil {
		return err
	}
	return w.w.Close()
}

func getAttribute(n *html.Node, key, default_ string) string {
	for _, attr := range n.Attr {
		if attr.Key == key {
			return attr.Val
		}
	}
	return default_
}

func nextNode(n *html.Node) *html.Node {
	if n.FirstChild != nil {
		return n.FirstChild
	} else if n.NextSibling != nil {
		return n.NextSibling
	} else {
		for {
			n = n.Parent
			if n == nil {
				break
			}
			if n.NextSibling != nil {
				return n.NextSibling
			}
		}
	}
	return nil
}

func HoistingHTML(w io.Writer, r io.Reader) error {
	var scripts []string
	var styles []string

	root, err := html.Parse(r)
	if err != nil {
		return err
	}

	node := root
	var head, body *html.Node

	popAndGoNext := func() {
		var next *html.Node
		for next == nil {
			next = node.NextSibling
			if next == nil {
				node = node.Parent
			}
		}

		node.Parent.RemoveChild(node)
		node = next
	}

	for node != nil {
		if node.DataAtom == atom.Head {
			head = node
		}
		if node.DataAtom == atom.Body {
			body = node
		}

		if node.DataAtom == atom.Script && getAttribute(node, "type", "text/javascript") == "text/javascript" && node.FirstChild != nil {
			scripts = append(scripts, node.FirstChild.Data)
			popAndGoNext()
		} else if node.DataAtom == atom.Style && getAttribute(node, "type", "text/css") == "text/css" && node.FirstChild != nil {
			styles = append(styles, node.FirstChild.Data)
			popAndGoNext()
		} else {
			node = nextNode(node)
		}
	}

	if script := strings.Join(scripts, "\n;\n"); script != "" {
		body.AppendChild(&html.Node{
			Type:     html.ElementNode,
			DataAtom: atom.Script,
			Data:     "script",
			FirstChild: &html.Node{
				Type: html.TextNode,
				Data: script,
			},
		})
	}

	if style := strings.Join(styles, "\n"); style != "" {
		head.AppendChild(&html.Node{
			Type:     html.ElementNode,
			DataAtom: atom.Style,
			Data:     "style",
			FirstChild: &html.Node{
				Type: html.TextNode,
				Data: style,
			},
		})
	}

	return html.Render(w, root)
}
