package main

import (
	"bytes"
	"html/template"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"

	"gopkg.in/yaml.v3"
)

type Article struct {
	URL         string           `yaml:"-"`
	Path        string           `yaml:"-"`
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
	Markdown    []byte           `yaml:"-"`
	Content     template.HTML    `yaml:"-"`
	SourceInfo  os.FileInfo      `yaml:"-"`
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

func (l *ArticleLoader) Load(externalPath string, source []byte, info os.FileInfo) (Article, error) {
	separatorPos := bytes.Index(source[3:], []byte("\n---\n")) + 3

	article := Article{
		URL:        "https://blanktar.jp" + externalPath,
		Path:       externalPath,
		Markdown:   source[separatorPos+5:],
		SourceInfo: info,
	}

	if err := yaml.Unmarshal(source[:separatorPos], &article); err != nil {
		return Article{}, err
	}

	if len(article.BreadCrumb) == 0 {
		article.BreadCrumb = []BreadCrumbItem{
			{Name: "blanktar.jp", Path: "/"},
		}
	}

	if len(article.Image) == 0 {
		article.Image = []string{"https://blanktar.jp/images" + externalPath + ".png"}
	}

	var buf strings.Builder
	if err := l.md.Convert(&buf, article.Markdown); err != nil {
		return Article{}, err
	}
	article.Content = template.HTML(buf.String())

	return article, nil
}

type ArticleHook func(sourcePath string, article Article, conf ConvertConfig) error

type ArticleConverter struct {
	article  *ArticleLoader
	template *TemplateLoader
	hooks    []ArticleHook
}

func NewArticleConverter(template *TemplateLoader, hooks ...ArticleHook) (*ArticleConverter, error) {
	return &ArticleConverter{
		article:  NewArticleLoader(),
		template: template,
		hooks:    hooks,
	}, nil
}

func (c *ArticleConverter) Convert(source string, info os.FileInfo, conf ConvertConfig) error {
	if !strings.HasSuffix(source, ".md") {
		return ErrUnsupportedFormat
	}

	input, err := os.ReadFile(filepath.Join(conf.Source, source))
	if err != nil {
		return err
	}

	if len(input) < 8 || !bytes.Equal(input[:4], []byte("---\n")) {
		return ErrUnsupportedFormat
	}

	external := source[:len(source)-3]
	destination := path.Join(external, "index.html")
	if path.Base(external) == "index" {
		destination = external + ".html"
	}

	article, err := c.article.Load("/"+external, input, info)
	if err != nil {
		return err
	}

	if article.Layout == "" {
		if strings.HasPrefix(source, "blog/") {
			article.Layout = "blog/post.html"
		} else {
			article.Layout = "default.html"
		}
	}

	for _, hook := range c.hooks {
		if err := hook(source, article, conf); err != nil {
			return err
		}
	}

	if !NeedToUpdate(destination, info, conf) {
		return nil
	}

	tmpl, err := c.template.Load(article.Layout)
	if err != nil {
		return err
	}

	output, err := CreateOutput(destination, conf, "text/html")
	if err != nil {
		return err
	}

	err = tmpl.Execute(output, article)
	if err != nil {
		output.Close()
		return err
	}

	return output.Close()
}
