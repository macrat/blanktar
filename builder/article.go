package main

import (
	"bytes"
	"html/template"
	"os"
	"path/filepath"
	"strings"
	"time"

	"gopkg.in/yaml.v3"
)

type Article struct {
	Path        string        `yaml:"-"`
	Title       string        `yaml:"title"`
	Image       []string      `yaml:"image"`
	Description string        `yaml:"description"`
	Tags        []string      `yaml:"tags"`
	Published   time.Time     `yaml:"pubtime"`
	Updated     time.Time     `yaml:"modtime"`
	Layout      string        `yaml:"layout"`
	Markdown    []byte        `yaml:"-"`
	Content     template.HTML `yaml:"-"`
	SourceInfo  os.FileInfo   `yaml:"-"`
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
		Path:       externalPath,
		Markdown:   source[separatorPos+5:],
		SourceInfo: info,
	}

	if err := yaml.Unmarshal(source[:separatorPos], &article); err != nil {
		return Article{}, err
	}

	var buf strings.Builder
	if err := l.md.Convert(&buf, article.Markdown); err != nil {
		return Article{}, err
	}
	article.Content = template.HTML(buf.String())

	return article, nil
}

type ArticleHook func(sourcePath string, article Article, conf ConvertConfig)

type ArticleConverter struct {
	article  *ArticleLoader
	template *TemplateLoader
	hook     ArticleHook
}

func NewArticleConverter(template *TemplateLoader, hook ArticleHook) (*ArticleConverter, error) {
	return &ArticleConverter{
		article:  NewArticleLoader(),
		template: template,
		hook:     hook,
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

	destination := source[:len(source)-3] + ".html"

	article, err := c.article.Load("/"+destination, input, info)
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

	if c.hook != nil {
		c.hook(source, article, conf)
	}

	if !NeedToUpdate(destination, info, conf) {
		return nil
	}

	tmpl, err := c.template.Load(article.Layout)
	if err != nil {
		return err
	}

	output, err := CreateOutput(destination, conf)
	if err != nil {
		return err
	}
	defer output.Close()

	writer := MinifyWriter(output)
	defer writer.Close()

	return tmpl.Execute(writer, article)
}
