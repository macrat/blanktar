package main

import (
	"fmt"
	"sort"
	"strings"
	"time"

	"github.com/macrat/blanktar/builder/fs"
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

func (a *ArticleList) Add(article Article) {
	for i, x := range *a {
		if x.Path == article.Path {
			(*a)[i] = article
			return
		}
	}
	*a = append(*a, article)
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
	articles map[int]map[int]*ArticleList
	template *TemplateLoader
	statics  *ArticleList
}

func NewIndexGenerator(template *TemplateLoader) *IndexGenerator {
	return &IndexGenerator{
		articles: make(map[int]map[int]*ArticleList),
		template: template,
		statics:  &ArticleList{},
	}
}

func (g *IndexGenerator) Hook(ctx ConvertContext, path string, article Article) error {
	if !strings.HasPrefix(path, "blog/") {
		g.statics.Add(article)
		return nil
	}

	year := article.Published.Year()
	month := int(article.Published.Month())

	if _, ok := g.articles[year]; !ok {
		g.articles[year] = make(map[int]*ArticleList)
	}

	if _, ok := g.articles[year][month]; !ok {
		g.articles[year][month] = &ArticleList{}
	}

	g.articles[year][month].Add(article)

	return nil
}

func (g *IndexGenerator) Generate(ctx ConvertContext) error {
	if err := g.generateOrderedIndex(ctx); err != nil {
		return err
	}
	if err := g.generateYearlyIndex(ctx); err != nil {
		return err
	}
	if err := g.generateMonthlyIndex(ctx); err != nil {
		return err
	}
	if err := g.generateTagsIndex(ctx); err != nil {
		return err
	}
	if err := g.generateSitemap(ctx); err != nil {
		return err
	}
	if err := g.generateFeed(ctx); err != nil {
		return err
	}
	return nil
}

type IndexContext struct {
	URL        string
	Image      []string
	Page       int
	TotalPages int
	PagerFrom  int
	PagerTo    int
	Posts      ArticleList
}

func (g *IndexGenerator) generateOrderedIndex(ctx ConvertContext) error {
	var articles ArticleList
	for _, months := range g.articles {
		for _, posts := range months {
			articles = append(articles, *posts...)
		}
	}
	sort.Sort(sort.Reverse(articles))

	totalPages := len(articles)/ctx.PostsPerPage + 1

	tmpl, err := g.template.Load("blog/index.html")
	if err != nil {
		return err
	}

	for page := 0; page < totalPages; page++ {
		targetPath := fmt.Sprintf("blog/%d/index.html", page+1)
		if page == 0 {
			targetPath = "blog/index.html"
		}

		start := page * ctx.PostsPerPage
		end := page*ctx.PostsPerPage + ctx.PostsPerPage
		if end > len(articles) {
			end = len(articles)
		}
		posts := articles[start:end]

		if fs.ModTime(ctx.Dest, targetPath).After(posts.ModTime()) {
			continue
		}

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

		output, err := CreateOutput(ctx.Dest, targetPath, "text/html")
		if err != nil {
			return err
		}

		err = tmpl.Execute(output, IndexContext{
			URL:        "https://blanktar.jp/blog",
			Page:       page + 1,
			TotalPages: totalPages,
			PagerFrom:  pagerFrom,
			PagerTo:    pagerTo,
			Posts:      posts,
		})
		if err != nil {
			output.Close()
			return err
		}

		err = output.Close()
		if err != nil {
			return err
		}
	}

	return nil
}

type YearlyContext struct {
	URL   string
	Image []string
	Year  int
	Posts []ArticleList
}

func (g *IndexGenerator) generateYearlyIndex(ctx ConvertContext) error {
	for year, months := range g.articles {
		var latestUpdated time.Time

		posts := make([]ArticleList, 12)
		for i, ps := range months {
			sort.Sort(ps)
			posts[i-1] = *ps

			if ps.ModTime().After(latestUpdated) {
				latestUpdated = ps.ModTime()
			}
		}

		targetPath := fmt.Sprintf("blog/%04d/index.html", year)

		if fs.ModTime(ctx.Dest, targetPath).After(latestUpdated) {
			continue
		}

		tmpl, err := g.template.Load("blog/year.html")
		if err != nil {
			return err
		}

		output, err := CreateOutput(ctx.Dest, targetPath, "text/html")
		if err != nil {
			return err
		}

		err = tmpl.Execute(output, YearlyContext{
			URL:   fmt.Sprintf("https://blanktar.jp/blog/%04d", year),
			Year:  year,
			Posts: posts,
		})
		if err != nil {
			output.Close()
			return err
		}

		err = output.Close()
		if err != nil {
			return err
		}
	}

	return nil
}

type MonthlyContext struct {
	URL   string
	Image []string
	Year  int
	Month int
	Posts ArticleList
}

func (g *IndexGenerator) generateMonthlyIndex(ctx ConvertContext) error {
	for year, months := range g.articles {
		for month, posts := range months {
			targetPath := fmt.Sprintf("blog/%04d/%02d/index.html", year, month)

			if fs.ModTime(ctx.Dest, targetPath).After(posts.ModTime()) {
				continue
			}

			sort.Sort(posts)

			tmpl, err := g.template.Load("blog/month.html")
			if err != nil {
				return err
			}

			output, err := CreateOutput(ctx.Dest, targetPath, "text/html")
			if err != nil {
				return err
			}

			err = tmpl.Execute(output, MonthlyContext{
				URL:   fmt.Sprintf("https://blanktar.jp/blog/%04d/%02d", year, month),
				Year:  year,
				Month: month,
				Posts: *posts,
			})
			if err != nil {
				output.Close()
				return err
			}

			err = output.Close()
			if err != nil {
				return err
			}
		}
	}

	return nil
}

type TagPageContext struct {
	URL   string
	Image []string
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
	URL  string
	Tags TagPageContextList
}

func (g *IndexGenerator) generateTagsIndex(ctx ConvertContext) error {
	articles := make(map[string]ArticleList)
	var latestUpdated time.Time

	for _, months := range g.articles {
		for _, posts := range months {
			if posts.ModTime().After(latestUpdated) {
				latestUpdated = posts.ModTime()
			}

			for _, post := range *posts {
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

	tagIndexContext := TagIndexContext{
		URL: "https://blanktar.jp/blog/tags",
	}

	for tag, posts := range articles {
		targetPath := fmt.Sprintf("blog/tags/%s/index.html", EscapeTag(tag))

		tagPageContext := TagPageContext{
			URL:   fmt.Sprintf("https://blanktar.jp/blog/tags/%s", EscapeTag(tag)),
			Tag:   tag,
			Posts: posts,
		}
		tagIndexContext.Tags = append(tagIndexContext.Tags, tagPageContext)

		if fs.ModTime(ctx.Dest, targetPath).After(posts.ModTime()) {
			continue
		}

		sort.Sort(sort.Reverse(posts))

		output, err := CreateOutput(ctx.Dest, targetPath, "text/html")
		if err != nil {
			return err
		}

		err = tagPageTemplate.Execute(output, tagPageContext)
		if err != nil {
			output.Close()
			return err
		}

		err = output.Close()
		if err != nil {
			return err
		}
	}

	targetPath := "blog/tags/index.html"

	if fs.ModTime(ctx.Dest, targetPath).After(latestUpdated) {
		return nil
	}

	tagIndexTemplate, err := g.template.Load("blog/tagindex.html")
	if err != nil {
		return err
	}

	sort.Sort(tagIndexContext.Tags)

	output, err := CreateOutput(ctx.Dest, targetPath, "text/html")
	if err != nil {
		return err
	}

	err = tagIndexTemplate.Execute(output, tagIndexContext)
	if err != nil {
		output.Close()
		return err
	}

	return output.Close()
}

type SitemapContext struct {
	URL   string
	Image []string
	Pages []Article
}

func (g *IndexGenerator) generateSitemap(ctx ConvertContext) error {
	pages := *g.statics

	for _, months := range g.articles {
		for _, posts := range months {
			pages = append(pages, *posts...)
		}
	}

	sort.Sort(sort.Reverse(pages))

	targetPath := "sitemap.xml"

	if fs.ModTime(ctx.Dest, targetPath).After(pages.ModTime()) {
		return nil
	}

	tmpl, err := g.template.Load("sitemap.xml")
	if err != nil {
		return err
	}

	output, err := CreateOutput(ctx.Dest, targetPath, "application/xml")
	if err != nil {
		return err
	}

	err = tmpl.Execute(output, SitemapContext{
		URL:   "https://blanktar.jp/sitemap.xml",
		Pages: pages,
	})
	if err != nil {
		output.Close()
		return err
	}

	return output.Close()
}

type FeedContext struct {
	URL       string
	Image     []string
	Generated time.Time
	Posts     ArticleList
}

func (g *IndexGenerator) generateFeed(ctx ConvertContext) error {
	var posts ArticleList

	for _, months := range g.articles {
		for _, ps := range months {
			posts = append(posts, *ps...)
		}
	}

	sort.Sort(sort.Reverse(posts))

	targetPath := "blog/feed.xml"

	if fs.ModTime(ctx.Dest, targetPath).After(posts.ModTime()) {
		return nil
	}

	tmpl, err := g.template.Load("blog/feed.xml")
	if err != nil {
		return err
	}

	output, err := CreateOutput(ctx.Dest, targetPath, "application/xml")
	if err != nil {
		return err
	}

	err = tmpl.Execute(output, FeedContext{
		URL:       "https://blanktar.jp/blog/feed.xml",
		Generated: time.Now(),
		Posts:     posts,
	})
	if err != nil {
		output.Close()
		return err
	}

	return output.Close()
}
