package main

import (
	"fmt"
	"sort"
	"strings"
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
	if err := g.generateTagsIndex(conf); err != nil {
		return err
	}
	return nil
}

type IndexContext struct {
	Page       int
	TotalPages int
	PagerFrom  int
	PagerTo    int
	Posts      ArticleList
}

func (g *IndexGenerator) generateOrderedIndex(conf ConvertConfig) error {
	var articles ArticleList
	for _, months := range g.articles {
		for _, posts := range months {
			articles = append(articles, posts...)
		}
	}
	sort.Sort(sort.Reverse(articles))

	totalPages := len(articles)/conf.PostsPerPage + 1

	tmpl, err := g.template.Load("blog/index.html")
	if err != nil {
		return err
	}

	for page := 0; page < totalPages; page++ {
		targetPath := fmt.Sprintf("blog/%d.html", page+1)
		if page == 0 {
			targetPath = "blog/index.html"
		}

		start := page * conf.PostsPerPage
		end := page*conf.PostsPerPage + conf.PostsPerPage
		if end > len(articles) {
			end = len(articles)
		}
		posts := articles[start:end]

		if !NeedToUpdate(targetPath, posts, conf) {
			continue
		}

		output, err := CreateOutput(targetPath, conf)
		if err != nil {
			return err
		}
		defer output.Close()

		writer := MinifyWriter(output)
		defer writer.Close()

		pagerSize := 3
		pagerFrom := page - pagerSize + 1
		if pagerFrom < 1 {
			pagerFrom = 1
		}
		pagerTo := page + pagerSize + 1
		if page-pagerFrom < pagerSize-1 {
			pagerTo += pagerSize - 1 - (page - pagerFrom)
		}
		if pagerTo > totalPages {
			pagerTo = totalPages
		}
		if pagerTo-page < pagerSize+1 {
			pagerFrom -= pagerSize + 1 - (pagerTo - page)
		}

		err = tmpl.Execute(writer, IndexContext{
			Page:       page + 1,
			TotalPages: totalPages,
			PagerFrom:  pagerFrom,
			PagerTo:    pagerTo,
			Posts:      posts,
		})
		if err != nil {
			return err
		}
	}

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

type TagPageContext struct {
	Tag   string
	Posts ArticleList
}

type TagPageContextList []TagPageContext

func (l TagPageContextList) Len() int {
	return len(l)
}

func (l TagPageContextList) Less(i, j int) bool {
	if len(l[i].Posts) == len(l[j].Posts) {
		return l[i].Tag < l[j].Tag
	}
	return len(l[i].Posts) > len(l[j].Posts)
}

func (l TagPageContextList) Swap(i, j int) {
	l[i], l[j] = l[j], l[i]
}

type TagIndexContext struct {
	Tags TagPageContextList
}

func (g *IndexGenerator) generateTagsIndex(conf ConvertConfig) error {
	articles := make(map[string]ArticleList)
	var latestUpdated ArticleList

	for _, months := range g.articles {
		for _, posts := range months {
			if posts.ModTime().After(latestUpdated.ModTime()) {
				latestUpdated = posts
			}

			for _, post := range posts {
				for _, tag := range post.Tags {
					if _, ok := articles[tag]; !ok {
						articles[tag] = make(ArticleList, 0)
					}
					articles[tag] = append(articles[tag], post)
				}
			}
		}
	}

	tagPageTemplate, err := g.template.Load("blog/tagpage.html")
	if err != nil {
		return err
	}

	var tagIndexContext TagIndexContext

	for tag, posts := range articles {
		targetPath := fmt.Sprintf("blog/tags/%s.html", tag)

		tagPageContext := TagPageContext{
			Tag:   tag,
			Posts: posts,
		}
		tagIndexContext.Tags = append(tagIndexContext.Tags, tagPageContext)

		if !NeedToUpdate(targetPath, posts, conf) {
			continue
		}

		sort.Sort(sort.Reverse(posts))

		output, err := CreateOutput(targetPath, conf)
		if err != nil {
			return err
		}
		defer output.Close()

		writer := MinifyWriter(output)
		defer writer.Close()

		err = tagPageTemplate.Execute(writer, tagPageContext)
		if err != nil {
			return err
		}
	}

	targetPath := "blog/tags/index.html"

	if !NeedToUpdate(targetPath, latestUpdated, conf) {
		return nil
	}

	output, err := CreateOutput(targetPath, conf)
	if err != nil {
		return err
	}
	defer output.Close()

	writer := MinifyWriter(output)
	defer writer.Close()

	tagIndexTemplate, err := g.template.Load("blog/tagindex.html")
	if err != nil {
		return err
	}

	sort.Sort(tagIndexContext.Tags)

	return tagIndexTemplate.Execute(writer, tagIndexContext)
}
