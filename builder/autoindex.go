package main

import (
	"fmt"
	"sort"
	"strings"
	"sync"
	"time"
)

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

func (a ArticleList) ModTime() time.Time {
	if len(a) == 0 {
		return time.Time{}
	}

	latestModTime := a[0].SourceInfo.ModTime()
	for _, article := range a {
		if article.SourceInfo.ModTime().After(latestModTime) {
			latestModTime = article.SourceInfo.ModTime()
		}
	}
	return latestModTime
}

type IndexGenerator struct {
	sync.Mutex

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
	g.Lock()
	defer g.Unlock()

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
	g.Lock()
	defer g.Unlock()

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
	Year  int
	Posts []ArticleList
}

func (g *IndexGenerator) generateYearlyIndex(conf ConvertConfig) error {
	for year, months := range g.articles {
		var latestUpdated ArticleList

		posts := make([]ArticleList, 12)
		for i, ps := range months {
			sort.Sort(ps)
			posts[i-1] = ps

			if ps.ModTime().After(latestUpdated.ModTime()) {
				latestUpdated = ps
			}
		}

		targetPath := fmt.Sprintf("blog/%04d/index.html", year)

		if !NeedToUpdate(targetPath, latestUpdated, conf) {
			continue
		}

		tmpl, err := g.template.Load("blog/year.html")
		if err != nil {
			return err
		}

		output, err := CreateOutput(targetPath, conf)
		if err != nil {
			return err
		}
		defer output.Close()

		writer := MinifyWriter(output)
		defer writer.Close()

		err = tmpl.Execute(writer, YearlyContext{
			Year:  year,
			Posts: posts,
		})
		if err != nil {
			return err
		}
	}

	return nil
}

type MonthlyContext struct {
	Year  int
	Month int
	Posts ArticleList
}

func (g *IndexGenerator) generateMonthlyIndex(conf ConvertConfig) error {
	for year, months := range g.articles {
		for month, posts := range months {
			targetPath := fmt.Sprintf("blog/%04d/%02d/index.html", year, month)

			if !NeedToUpdate(targetPath, posts, conf) {
				continue
			}

			sort.Sort(posts)

			tmpl, err := g.template.Load("blog/month.html")
			if err != nil {
				return err
			}

			output, err := CreateOutput(targetPath, conf)
			if err != nil {
				return err
			}
			defer output.Close()

			writer := MinifyWriter(output)
			defer writer.Close()

			err = tmpl.Execute(writer, MonthlyContext{
				Year:  year,
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
