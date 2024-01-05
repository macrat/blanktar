package main

import (
	"bytes"
	"html/template"
	"path"
	"strings"
	"time"

	"github.com/macrat/blanktar/builder/fs"
	"github.com/macrat/blanktar/builder/thumbnail"
	"gopkg.in/yaml.v3"
)

type Article struct {
	name   string `yaml:"-"`
	source Source `yaml:"-"`

	URL  string `yaml:"-"`
	Path string `yaml:"-"`

	Title       string           `yaml:"title"`
	Image       []string         `yaml:"image"`
	Description string           `yaml:"description"`
	Tags        []string         `yaml:"tags"`
	Published   time.Time        `yaml:"pubtime"`
	Modified    time.Time        `yaml:"modtime"`
	FAQ         []FAQItem        `yaml:"faq"`
	HowTo       *HowTo           `yaml:"howto"`
	BreadCrumb  []BreadCrumbItem `yaml:"breadcrumb"`
	Layout      string           `yaml:"layout"`

	Markdown []byte        `yaml:"-"`
	Content  template.HTML `yaml:"-"`
}

func (a Article) Name() string {
	return a.name
}

func (a Article) Sources() SourceList {
	return SourceList{a.source}
}

type FAQItem struct {
	Question string `yaml:"question"`
	Answer   string `yaml:"answer"`
}

type HowTo struct {
	Name      string     `yaml:"name"`
	Supply    []string   `yaml:"supply"`
	Tool      []string   `yaml:"tool"`
	TotalTime string     `yaml:"totalTime"`
	Step      []StepItem `yaml:"step"`
}

type StepItem struct {
	Name  string `yaml:"name"`
	Text  string `yaml:"text"`
	URL   string `yaml:"url"`
	Image string `yaml:"image"`
}

type BreadCrumbItem struct {
	Name string `yaml:"name"`
	Path string `yaml:"path"`
}

type ArticleLoader struct {
	md *Markdown
}

func NewArticleLoader() *ArticleLoader {
	return &ArticleLoader{
		md: NewMarkdown(),
	}
}

func (l *ArticleLoader) Load(externalPath string, raw []byte) (Article, error) {
	separatorPos := bytes.Index(raw[3:], []byte("\n---\n")) + 3

	article := Article{
		URL:      "https://blanktar.jp" + externalPath,
		Path:     externalPath,
		Markdown: raw[separatorPos+5:],
	}

	if err := yaml.Unmarshal(raw[:separatorPos], &article); err != nil {
		return Article{}, err
	}

	if len(article.BreadCrumb) == 0 {
		article.BreadCrumb = []BreadCrumbItem{
			{Name: "blanktar.jp", Path: "/"},
		}
	}

	if len(article.Image) == 0 {
		article.Image = []string{"/images" + externalPath + ".png"}
	}

	var buf strings.Builder
	if err := l.md.Convert(&buf, article.Markdown); err != nil {
		return Article{}, err
	}
	article.Content = template.HTML(buf.String())

	return article, nil
}

type ArticleConverter struct {
	article   *ArticleLoader
	template  *TemplateLoader
	thumbnail thumbnail.Generator
}

func NewArticleConverter(template *TemplateLoader, regularFontPath, semiBoldFontPath string) (*ArticleConverter, error) {
	generator, err := thumbnail.NewGenerator(regularFontPath, semiBoldFontPath)
	if err != nil {
		return nil, err
	}

	return &ArticleConverter{
		article:   NewArticleLoader(),
		template:  template,
		thumbnail: generator,
	}, nil
}

func (c *ArticleConverter) Convert(dst fs.Writable, src Source, conf Config) (ArtifactList, error) {
	if !strings.HasSuffix(src.Name(), ".md") {
		return nil, ErrUnsupportedFormat
	}

	input, err := src.ReadAll()
	if err != nil {
		return nil, err
	}

	if len(input) < 8 || !bytes.Equal(input[:4], []byte("---\n")) {
		return nil, ErrUnsupportedFormat
	}

	externalPath := src.Name()[:len(src.Name())-len(".md")]
	if strings.HasSuffix(externalPath, "/index") {
		externalPath = externalPath[:len(externalPath)-len("/index")]
	}
	if externalPath == "index" {
		externalPath = ""
	}

	article, err := c.convertHTML(dst, src, externalPath, input)
	if err != nil {
		return nil, err
	}

	asset, err := c.convertImage(dst, src, externalPath, article)
	if err != nil {
		return nil, err
	}

	return ArtifactList{
		article,
		asset,
	}, nil
}

func (c *ArticleConverter) convertHTML(dst fs.Writable, src Source, externalPath string, input []byte) (Article, error) {
	destPath := path.Join(externalPath, "index.html")
	if path.Base(externalPath) == "index" {
		destPath = externalPath + ".html"
	}

	article, err := c.article.Load("/"+externalPath, input)
	if err != nil {
		return Article{}, err
	}
	article.name = destPath
	article.source = src

	if article.Layout == "" {
		if strings.HasPrefix(src.Name(), "blog/") {
			article.Layout = "blog/post.html"
		} else {
			article.Layout = "default.html"
		}
	}

	if fs.ModTime(dst, destPath).After(src.ModTime()) {
		return article, nil
	}

	tmpl, err := c.template.Load(article.Layout)
	if err != nil {
		return Article{}, err
	}

	output, err := CreateOutput(dst, destPath, "text/html")
	if err != nil {
		return Article{}, err
	}

	err = tmpl.Execute(output, article)
	if err != nil {
		output.Close()
		return Article{}, err
	}

	return article, output.Close()
}

func (c *ArticleConverter) convertImage(dst fs.Writable, src Source, externalPath string, article Article) (Asset, error) {
	outputPath := path.Join("images", externalPath+".png")

	asset := Asset{
		name:   outputPath,
		source: src,
	}

	if fs.ModTime(dst, outputPath).After(src.ModTime()) {
		return asset, nil
	}

	w, err := CreateOutput(dst, outputPath, "image/png")
	if err != nil {
		return Asset{}, err
	}
	defer w.Close()

	err = c.thumbnail.Generate(w, article.Title, article.Tags)
	return asset, err
}
