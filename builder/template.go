package main

import (
	"html/template"
	"math"
	"path/filepath"
)

type TemplateLoader struct {
	basePath     string
	baseTemplate *template.Template
	cache        map[string]*template.Template
}

func NewTemplateLoader(basePath string) (*TemplateLoader, error) {
	baseTemplate, err := template.ParseFiles(filepath.Join(basePath, "base.html"))
	if err != nil {
		return nil, err
	}

	baseTemplate = baseTemplate.Funcs(template.FuncMap{
		"add": func(x, y int) int {
			return x + y
		},
		"sub": func(x, y int) int {
			return x - y
		},
		"count": func(start, end int) []int {
			var result []int
			for i := start; i <= end; i++ {
				result = append(result, i)
			}
			return result
		},
		"abs": func(x int) int {
			if x < 0 {
				return -x
			}
			return x
		},
		"escapetag": EscapeTag,
		"tagsize": func(n int) int {
			return int(math.Ceil(math.Sqrt(math.Sqrt(float64(n))) * 100))
		},
		"xmldecralation": func() template.HTML {
			return template.HTML(`<?xml version="1.0" encoding="UTF-8"?>`)
		},
	})

	return &TemplateLoader{
		basePath:     basePath,
		baseTemplate: baseTemplate,
		cache:        make(map[string]*template.Template),
	}, nil
}

func (tl *TemplateLoader) Load(name string) (*template.Template, error) {
	t, ok := tl.cache[name]
	if ok {
		return t, nil
	}

	t, err := tl.baseTemplate.Clone()
	if err != nil {
		return nil, err
	}

	t, err = t.ParseFiles(filepath.Join(tl.basePath, name))
	if err != nil {
		return nil, err
	}

	t = t

	tl.cache[name] = t

	return t, nil
}
