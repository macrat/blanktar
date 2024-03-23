package main

import (
	"bytes"
	"fmt"
	"html/template"
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

func (c *Markdown) Convert(w io.Writer, source []byte) error {
	var buf bytes.Buffer

	code := NewCodeRenderer(c.lexers)
	md := markdown.NewConverter(markdown.WithNodeRenderers(
		code,
		HeadingRenderer{},
		ImageRenderer{},
		TableRenderer{},
		LinkRenderer{},
	))

	if err := md.Convert(&buf, source); err != nil {
		return err
	}

	if code.Count > 0 {
		if err := code.WriteCodeBlockAssets(w); err != nil {
			return err
		}
	}

	code.Count = 0

	_, err := buf.WriteTo(w)
	return err
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

	_, err = fmt.Fprintf(w, `<div class="chroma" data-code="%s"><button onclick='copyCodeBlock(this)'>Copy</button><pre>`, template.HTMLEscapeString(plainCode))
	if err != nil {
		return ast.WalkStop, err
	}

	err = r.formatter.Format(w, styles.GitHub, iterator)
	if err != nil {
		return ast.WalkStop, err
	}

	_, err = fmt.Fprintf(w, `</pre></div>`)
	return ast.WalkSkipChildren, err
}

func (r *CodeRenderer) WriteCodeBlockAssets(w io.Writer) error {
	_, err := fmt.Fprintf(w, `
		<script>
		function copyCodeBlock(elm) {
			navigator.clipboard.writeText(elm.parentNode.dataset.code).then(() => {
				elm.innerText = "Copied!";
				setTimeout(() => {
					elm.innerText = "Copy";
				}, 1000);
			});
		}
		</script>
		<style>
		.chroma {
			line-height: 1.5;
			border: 1px solid #433;
			position: relative;
			margin: .5em 0;
		}
		.chroma::before, .chroma::after {
			content: "";
			position: absolute;
			top: 24px;
			bottom: 24px;
			width: 12px;
			z-index: 1;
		}
		.chroma::before {
			left: 0;
		}
		.chroma::after {
			right: 0;
		}
		.chroma pre {
			margin: 0;
			padding: 24px 12px;
			overflow-x: auto;
			font-family: monospace, sans-serif;
			font-size: 90%%;
		}
		.chroma .line {
			width: fit-content;
		}
		.chroma button {
			position: absolute;
			top: 2px;
			right: 2px;
			height: 24px;
			padding: 0 8px;
			color: inherit;
			background: transparent;
			border: 1px solid #808080;
			border-radius: 4px;
			cursor: pointer;
			opacity: 0;
			visibility: hidden;
			transition: opacity .2s, visibility .2s;
			z-index: 2;
		}
		.chroma:hover button {
			opacity: 1;
			visibility: visible;
		}
		@media (hover: none) {
			.chroma button {
				opacity: 1;
				visibility: visible;
			}
		}
		@media (not (prefers-color-scheme: dark)) and (not (prefers-contrast: more)) {
			.chroma::before {
				background: linear-gradient(to left, #0000, #fff);
			}
			.chroma::after {
				background: linear-gradient(to right, #0000, #fff);
			}
	`)
	if err != nil {
		return err
	}

	err = r.formatter.WriteCSS(w, styles.GitHub)
	if err != nil {
		return err
	}

	_, err = fmt.Fprintf(w, `}
		@media (prefers-color-scheme: dark) and (not (prefers-contrast: more)) {
			.chroma {
				border: none;
			}
			.chroma::before {
				background: linear-gradient(to left, #0000, #2e3440);
			}
			.chroma::after {
				background: linear-gradient(to right, #0000, #2e3440);
			}
	`)
	if err != nil {
		return err
	}

	err = r.formatter.WriteCSS(w, styles.Nord)
	if err != nil {
		return err
	}

	_, err = fmt.Fprintf(w, `}
		@media (prefers-contrast: more) {
			.chroma {
				border-color: currentColor;
			}
	`)
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

	_, err = fmt.Fprintf(w, "}\n</style>")
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
}

func (r ImageRenderer) Priority() int {
	return 500
}

func (r ImageRenderer) Kind() ast.NodeKind {
	return ast.KindImage
}

func (r ImageRenderer) Render(w markdown.BufWriter, source []byte, node ast.Node, entering bool) (ast.WalkStatus, error) {
	if !entering {
		fmt.Fprintf(w, "</img>")
		return ast.WalkContinue, nil
	}

	image := node.(*ast.Image)

	sizes := regexp.MustCompile(`^([0-9]+)x([0-9]+)$`).FindSubmatch(image.Title)
	if len(sizes) == 3 {
		_, err := fmt.Fprintf(
			w,
			`<img src="%s" alt="%s" width="%s" height="%s" loading="lazy" />`,
			image.Destination,
			image.Text(source),
			sizes[1],
			sizes[2],
		)

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
