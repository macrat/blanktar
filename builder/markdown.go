package main

import (
	"bytes"
	"fmt"
	"io"
	"net/url"
	"regexp"
	"strings"
	"sync"

	"github.com/alecthomas/chroma"
	"github.com/alecthomas/chroma/formatters/html"
	"github.com/alecthomas/chroma/lexers"
	"github.com/alecthomas/chroma/styles"
	"github.com/macrat/blanktar/builder/markdown"
	"github.com/yuin/goldmark/ast"
	extraAst "github.com/yuin/goldmark/extension/ast"
)

type LexerRegistry struct {
	sync.Mutex
	lexers map[string]chroma.Lexer
}

func (r *LexerRegistry) Get(lang, code string) chroma.Lexer {
	r.Lock()
	defer r.Unlock()

	lexer := r.lexers[lang]
	if lexer != nil {
		return lexer
	}

	lexer = lexers.Get(string(lang))
	if lexer == nil {
		lexer = lexers.Analyse(code)
		if lexer == nil {
			lexer = lexers.Fallback
		}
	}

	r.lexers[lexer.Config().Name] = lexer
	r.lexers[lang] = lexer

	return lexer
}

type Markdown struct {
	lexers *LexerRegistry
}

func NewMarkdown() *Markdown {
	return &Markdown{
		lexers: &LexerRegistry{
			lexers: make(map[string]chroma.Lexer),
		},
	}
}

func (c *Markdown) Convert(w io.Writer, source []byte) (ResourceList, error) {
	var buf bytes.Buffer

	code := NewCodeRenderer(c.lexers)
	image := &ImageRenderer{}
	md := markdown.NewConverter(markdown.WithNodeRenderers(
		code,
		HeadingRenderer{},
		image,
		TableRenderer{},
		LinkRenderer{},
	))

	if err := md.Convert(&buf, source); err != nil {
		return nil, err
	}

	if code.Count > 0 {
		if _, err := w.Write([]byte("<style>")); err != nil {
			return nil, err
		}

		if err := code.WriteStyleSheet(w); err != nil {
			return nil, err
		}

		if _, err := w.Write([]byte("</style>")); err != nil {
			return nil, err
		}
	}

	code.Count = 0

	var resources ResourceList
	resources.Add(image.Resources...)

	_, err := buf.WriteTo(w)
	return resources, err
}

// CodeRenderer is a renderer for fenced code blocks with highlighting.
type CodeRenderer struct {
	formatter *html.Formatter
	lexers    *LexerRegistry
	Count     int
}

func NewCodeRenderer(lexers *LexerRegistry) *CodeRenderer {
	return &CodeRenderer{
		formatter: html.New(
			html.WithClasses(true),
			html.PreventSurroundingPre(true),
		),
		lexers: lexers,
	}
}

func (r *CodeRenderer) Priority() int {
	return 500
}

func (r *CodeRenderer) Kind() ast.NodeKind {
	return ast.KindFencedCodeBlock
}

func (r *CodeRenderer) Render(w markdown.BufWriter, source []byte, node ast.Node, entering bool) (ast.WalkStatus, error) {
	if !entering {
		return ast.WalkContinue, nil
	}

	r.Count++

	code := node.(*ast.FencedCodeBlock)
	lang := code.Language(source)

	var plainCodeLines []string
	lines := code.Lines()
	for i := 0; i < lines.Len(); i++ {
		line := lines.At(i)
		plainCodeLines = append(plainCodeLines, string(line.Value(source)))
	}
	plainCode := strings.Join(plainCodeLines, "")

	lexer := r.lexers.Get(string(lang), plainCode)

	iterator, err := lexer.Tokenise(nil, plainCode)
	if err != nil {
		return ast.WalkStop, err
	}

	_, err = fmt.Fprintf(w, `<pre class="chroma">`)
	if err != nil {
		return ast.WalkStop, err
	}

	err = r.formatter.Format(w, styles.GitHub, iterator)
	if err != nil {
		return ast.WalkStop, err
	}

	_, err = fmt.Fprintf(w, `</pre>`)
	return ast.WalkSkipChildren, err
}

func (r *CodeRenderer) WriteStyleSheet(w io.Writer) error {
	_, err := fmt.Fprintf(w, "@media (not (prefers-color-scheme: dark)) and (not (prefers-contrast: more)) {")
	if err != nil {
		return err
	}

	err = r.formatter.WriteCSS(w, styles.GitHub)
	if err != nil {
		return err
	}

	_, err = fmt.Fprintf(w, "}\n@media (prefers-color-scheme: dark) and (not (prefers-contrast: more)) {")
	if err != nil {
		return err
	}

	err = r.formatter.WriteCSS(w, styles.Nord)
	if err != nil {
		return err
	}

	_, err = fmt.Fprintf(w, "}\n@media (prefers-contrast: more) {")
	if err != nil {
		return err
	}

	HighContrast := chroma.MustNewStyle("bw", chroma.StyleEntries{
		chroma.Comment:               "italic",
		chroma.CommentPreproc:        "noitalic",
		chroma.Keyword:               "bold",
		chroma.KeywordPseudo:         "nobold",
		chroma.KeywordType:           "nobold",
		chroma.OperatorWord:          "bold",
		chroma.NameClass:             "bold",
		chroma.NameNamespace:         "bold",
		chroma.NameException:         "bold",
		chroma.NameEntity:            "bold",
		chroma.NameTag:               "bold",
		chroma.LiteralString:         "italic",
		chroma.LiteralStringInterpol: "bold",
		chroma.LiteralStringEscape:   "bold",
		chroma.GenericHeading:        "bold",
		chroma.GenericSubheading:     "bold",
		chroma.GenericEmph:           "italic",
		chroma.GenericStrong:         "bold",
		chroma.GenericPrompt:         "bold",
		chroma.Error:                 "border:#FF0000",
	})
	err = r.formatter.WriteCSS(w, HighContrast)
	if err != nil {
		return err
	}

	_, err = fmt.Fprintf(w, "}")
	return err
}

// HeadingRenderer renders headings with back link.
type HeadingRenderer struct {
}

func (r HeadingRenderer) Priority() int {
	return 500
}

func (r HeadingRenderer) Kind() ast.NodeKind {
	return ast.KindHeading
}

func (r HeadingRenderer) Render(w markdown.BufWriter, source []byte, node ast.Node, entering bool) (ast.WalkStatus, error) {
	if !entering {
		_, err := fmt.Fprintf(w, "</a></h%d>", node.(*ast.Heading).Level+1)
		return ast.WalkContinue, err
	}

	heading := node.(*ast.Heading)
	level := heading.Level + 1
	id := url.QueryEscape(string(heading.Text(source)))

	_, err := fmt.Fprintf(w, `<h%d id="%s"><a href="#%s">`, level, id, id)
	return ast.WalkContinue, err
}

// ImageRenderer renders images with width and height.
type ImageRenderer struct {
	Resources ResourceList
}

func (r ImageRenderer) Priority() int {
	return 500
}

func (r ImageRenderer) Kind() ast.NodeKind {
	return ast.KindImage
}

func (r *ImageRenderer) Render(w markdown.BufWriter, source []byte, node ast.Node, entering bool) (ast.WalkStatus, error) {
	if !entering {
		fmt.Fprintf(w, "</img>")
		return ast.WalkContinue, nil
	}

	image := node.(*ast.Image)

	sizes := regexp.MustCompile(`^([0-9]+)x([0-9]+)$`).FindSubmatch(image.Title)
	if len(sizes) == 3 {
		_, err := fmt.Fprintf(
			w,
			`<img src="%s" alt="%s" width="%s" height="%s" />`,
			image.Destination,
			image.Text(source),
			sizes[1],
			sizes[2],
		)

		r.Resources.Add(ResourceInfo{
			Type: "image",
			URL:  string(image.Destination),
		})

		return ast.WalkSkipChildren, err
	} else {
		return ast.WalkStop, fmt.Errorf("All images needs size as its title but got %q.", image.Title)
	}
}

// TableRenderer renders tables with scrollbar.
type TableRenderer struct {
}

func (r TableRenderer) Priority() int {
	return 500
}

func (r TableRenderer) Kind() ast.NodeKind {
	return extraAst.KindTable
}

func (r TableRenderer) Render(w markdown.BufWriter, source []byte, node ast.Node, entering bool) (ast.WalkStatus, error) {
	if !entering {
		_, err := fmt.Fprintf(w, "</table></div>")
		return ast.WalkContinue, err
	}

	_, err := fmt.Fprintf(w, `<div style="overflow-x: auto"><table>`)
	return ast.WalkContinue, err
}

// LinkRenderer renders links with target="_blank" for external links.
type LinkRenderer struct {
}

func (r LinkRenderer) Priority() int {
	return 500
}

func (r LinkRenderer) Kind() ast.NodeKind {
	return ast.KindLink
}

func (r LinkRenderer) Render(w markdown.BufWriter, source []byte, node ast.Node, entering bool) (ast.WalkStatus, error) {
	if !entering {
		_, err := fmt.Fprintf(w, "</a>")
		return ast.WalkContinue, err
	}

	link := node.(*ast.Link)
	if link.Destination == nil {
		_, err := fmt.Fprintf(w, "<a>")
		return ast.WalkContinue, err
	}

	dest := string(link.Destination)

	attribute := `target="_blank" rel="noreferrer noopener"`
	if strings.HasPrefix(dest, "https://blanktar.jp/") {
		dest = strings.Replace(dest, "https://blanktar.jp/", "/", 1)
		attribute = `target="_blank"`
	} else if strings.HasPrefix(dest, "/") || strings.HasPrefix(dest, "#") {
		attribute = ""
	}

	_, err := fmt.Fprintf(w, `<a href="%s" %s>`, dest, attribute)

	return ast.WalkContinue, err
}
