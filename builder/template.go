package main

import (
	"html/template"
	"math"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"crypto/sha256"
	"encoding/base64"
)

type TemplateLoader struct {
	sync.Mutex

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
		"zfill": func(x, n int) string {
			s := strconv.Itoa(x)
			if len(s) >= n {
				return s
			}
			return strings.Repeat("0", n-len(s)) + s
		},
		"concat": func(s ...string) string {
			return strings.Join(s, "")
		},
		"escapetag": EscapeTag,
		"tagsize": func(n int) int {
			return int(math.Ceil(math.Sqrt(math.Sqrt(float64(n))) * 100))
		},
		"xmldecralation": func() template.HTML {
			return template.HTML(`<?xml version="1.0" encoding="UTF-8"?>`)
		},
		"shorthash": func(s string) string {
			hash := sha256.New()
			hash.Write([]byte(s))
			return base64.URLEncoding.EncodeToString(hash.Sum(nil)[:8])[:8]
		},
	})

	return &TemplateLoader{
		basePath:     basePath,
		baseTemplate: baseTemplate,
		cache:        make(map[string]*template.Template),
	}, nil
}

func (tl *TemplateLoader) Load(name string) (*template.Template, error) {
	tl.Lock()
	defer tl.Unlock()

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

	tl.cache[name] = t

	return t, nil
}
