package main

import (
	"io"
	"fmt"
	"sort"
	"strings"
	"path/filepath"
	"log"
	"os"
	"errors"
)

var (
	ErrUnsupportedFormat = errors.New("unsupported format")
	SkipToConvert = ErrUnsupportedFormat
)

func CreateOutput(path string, conf ConvertConfig) (*os.File, error) {
	os.MkdirAll(filepath.Join(conf.Destination, filepath.Dir(path)), 0755)
	return os.Create(filepath.Join(conf.Destination, path))
}

type ConvertConfig struct {
	Destination string
	Source	    string
}

type Converter interface {
	Convert(source string, conf ConvertConfig) error
}

type ConverterSet []Converter

func (c ConverterSet) Convert(source string, conf ConvertConfig) error {
	for _, converter := range c {
		err := converter.Convert(source, conf)
		if !errors.Is(err, SkipToConvert) {
			return err
		}
	}
	return ErrUnsupportedFormat
}

type ArticleHook func(path string, article Article, conf ConvertConfig)

type ArticleConverter struct {
	article  *ArticleLoader
	template *TemplateLoader
	hook     ArticleHook
}

func NewArticleConverter(template *TemplateLoader, hook ArticleHook) (*ArticleConverter, error) {
	return &ArticleConverter{
		article: NewArticleLoader(),
		template: template,
		hook: hook,
	}, nil
}

func (c *ArticleConverter) Convert(path string, conf ConvertConfig) error {
	if !strings.HasSuffix(path, ".md") {
		return SkipToConvert
	}

	input, err := os.ReadFile(filepath.Join(conf.Source, path))
	if err != nil {
		return err
	}
	
	outputPath := path[:len(path) - 3] + ".html"

	article, err := c.article.Load("/" + outputPath, input)
	if err != nil {
		return err
	}

	if article.Layout == "" {
		if strings.HasPrefix(path, "blog/") {
			article.Layout = "blog/post.html"
		} else {
			article.Layout = "default.html"
		}
	}

	if c.hook != nil {
		c.hook(path, article, conf)
	}

	tmpl, err := c.template.Load(article.Layout)
	if err != nil {
		return err
	}

	output, err := CreateOutput(outputPath, conf)
	if err != nil {
		return err
	}
	defer output.Close()

	writer := MinifyWriter(output)
	defer writer.Close()

	return tmpl.Execute(writer, article)
}

type CopyConverter struct {
}

func (c CopyConverter) Convert(path string, conf ConvertConfig) error {
	input, err := os.Open(filepath.Join(conf.Source, path))
	if err != nil {
		return err
	}
	defer input.Close()

	output, err := CreateOutput(path, conf)
	if err != nil {
		return err
	}
	defer output.Close()

	_, err = io.Copy(output, input)
	return err
}

type ArticleList []Article

func (a ArticleList) Len() int {
	return len(a)
}

func (a ArticleList) Less(i, j int) bool {
	return a[i].Published.Before(a[j].Published)
}

func (a ArticleList) Swap(i, j int) {
	a[i], a[j] = a[j], a[i]
}

type IndexGenerator struct {
	articles map[int]map[int]ArticleList
	template *TemplateLoader
	statics  ArticleList
}

func NewIndexGenerator(template *TemplateLoader) *IndexGenerator {
	return &IndexGenerator{
		articles: make(map[int]map[int]ArticleList),
		template: template,
	}
}

func (g *IndexGenerator) Hook(path string, article Article, conf ConvertConfig) {
	if !strings.HasPrefix(path, "blog/") {
		g.statics = append(g.statics, article)
		return
	}

	year := article.Published.Year()
	month := int(article.Published.Month())

	if _, ok := g.articles[year]; !ok {
		g.articles[year] = make(map[int]ArticleList)
	}

	if _, ok := g.articles[year][month]; !ok {
		g.articles[year][month] = make(ArticleList, 0)
	}

	g.articles[year][month] = append(g.articles[year][month], article)
}

func (g *IndexGenerator) Generate(conf ConvertConfig) error {
	if err := g.generateOrderedIndex(conf); err != nil {
		return err
	}
	if err := g.generateYearlyIndex(conf); err != nil {
		return err
	}
	if err := g.generateMonthlyIndex(conf); err != nil {
		return err
	}
	return nil
}

func (g *IndexGenerator) generateOrderedIndex(conf ConvertConfig) error {
	return nil
}

type YearlyContext struct {
	Year int
	Posts []ArticleList
}

func (g *IndexGenerator) generateYearlyIndex(conf ConvertConfig) error {
	for year, months := range g.articles {
		posts := make([]ArticleList, 12)
		for i, ps := range months {
			sort.Sort(ps)
			posts[i - 1] = ps
		}


		tmpl, err := g.template.Load("blog/year.html")
		if err != nil {
			return err
		}

		output, err := CreateOutput(fmt.Sprintf("blog/%04d/index.html", year), conf)
		if err != nil {
			return err
		}
		defer output.Close()

		writer := MinifyWriter(output)
		defer writer.Close()

		err = tmpl.Execute(writer, YearlyContext {
			Year: year,
			Posts: posts,
		})
		if err != nil {
			return err
		}
	}

	return nil
}

type MonthlyContext struct {
	Year int
	Month int
	Posts ArticleList
}

func (g *IndexGenerator) generateMonthlyIndex(conf ConvertConfig) error {
	for year, months := range g.articles {
		for month, posts := range months {
			sort.Sort(posts)

			tmpl, err := g.template.Load("blog/month.html")
			if err != nil {
				return err
			}

			output, err := CreateOutput(fmt.Sprintf("blog/%04d/%02d/index.html", year, month), conf)
			if err != nil {
				return err
			}
			defer output.Close()

			writer := MinifyWriter(output)
			defer writer.Close()

			err = tmpl.Execute(writer, MonthlyContext {
				Year: year,
				Month: month,
				Posts: posts,
			})
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func main() {
	conf := ConvertConfig{
		Destination: "../dist",
		Source: "../pages",
	}

	template, err := NewTemplateLoader("../templates")
	if err != nil {
		log.Fatal(err)
	}

	indexGenerator := NewIndexGenerator(template)

	mdConverter, err := NewArticleConverter(template, indexGenerator.Hook)
	if err != nil {
		log.Fatal(err)
	}

	converter := ConverterSet{
		mdConverter,
		CopyConverter{},
	}

	err = filepath.Walk(conf.Source, func(fpath string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() || strings.HasPrefix(info.Name(), ".") {
			return nil
		}

		path, err := filepath.Rel(conf.Source, fpath)
		if err != nil {
			return err
		}

		err = converter.Convert(path, conf)
		if err != nil {
			return fmt.Errorf("%w: %s", err, path)
		}

		return nil
	})
	if err != nil {
		log.Fatal(err)
	}

	err = indexGenerator.Generate(conf)
	if err != nil {
		log.Fatal(err)
	}
}
