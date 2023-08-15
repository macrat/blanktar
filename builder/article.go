package main

import (
	"time"
	"html/template"
	"bytes"
	"strings"

	"gopkg.in/yaml.v3"
)

type Article struct {
	Path        string        `yaml:"-"`
	Title       string        `yaml:"title"`
	Image       []string        `yaml:"image"`
	Description string        `yaml:"description"`
	Tags        []string      `yaml:"tags"`
	Published   time.Time     `yaml:"pubtime"`
	Updated     time.Time     `yaml:"modtime"`
	Layout      string        `yaml:"layout"`
	Markdown    []byte		  `yaml:"-"`
	Content     template.HTML `yaml:"-"`
}

type ArticleLoader struct {
	md *Markdown
}

func NewArticleLoader() *ArticleLoader {
	return &ArticleLoader{
		md: NewMarkdown(),
	}
}

func (l *ArticleLoader) Load(path string, source []byte) (Article, error) {
	var article Article

	separatorPos := bytes.Index(source[3:], []byte("\n---\n")) + 3

	if err := yaml.Unmarshal(source[:separatorPos], &article); err != nil {
		return Article{}, err
	}

	article.Path = path
	article.Markdown = source[separatorPos+5:]

	var buf strings.Builder
	if err := l.md.Convert(&buf, article.Markdown); err != nil {
		return Article{}, err
	}
	article.Content = template.HTML(buf.String())

	return article, nil
}
