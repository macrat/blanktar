package main

import (
	"encoding/json"
	"fmt"
	"regexp"
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

	latestModTime := a[0].Sources().ModTime()
	for _, article := range a {
		if article.Sources().ModTime().After(latestModTime) {
			latestModTime = article.Sources().ModTime()
		}
	}
	return latestModTime
}

func (a ArticleList) Sources() SourceList {
	sources := make(SourceList, 0, len(a))
	for _, article := range a {
		sources = append(sources, article.Sources()...)
	}
	return sources
}

func (a ArticleList) GeneratePerPath(path func(a Article) string, generate func(path string, articles ArticleList) error) error {
	if len(a) == 0 {
		return nil
	}

	current := path(a[0])
	store := ArticleList{a[0]}

	for _, article := range a[1:] {
		p := path(article)
		if p == current {
			store = append(store, article)
		} else {
			if err := generate(current, store); err != nil {
				return err
			}

			current = p
			store = ArticleList{article}
		}
	}

	if len(store) > 0 {
		return generate(current, store)
	}

	return nil
}

type IndexGenerator struct {
	template *TemplateLoader
}

func (g IndexGenerator) Generate(dst fs.Writable, artifacts ArtifactList, conf Config) (ArtifactList, error) {
	var articles ArticleList
	var posts ArticleList
	for _, artifact := range artifacts {
		if article, ok := artifact.(Article); ok {
			articles = append(articles, article)
			if strings.HasPrefix(article.Name(), "static/blog/") {
				posts.Add(article)
			}
		}
	}
	sort.Sort(posts)
	sort.Sort(sort.Reverse(articles))

	var result ArtifactList

	if as, err := g.generateOrderedIndex(dst, posts, conf); err == nil {
		result = append(result, as...)
	} else {
		return nil, err
	}
	if as, err := g.generateYearlyIndex(dst, posts, conf); err == nil {
		result = append(result, as...)
	} else {
		return nil, err
	}
	if as, err := g.generateMonthlyIndex(dst, posts, conf); err == nil {
		result = append(result, as...)
	} else {
		return nil, err
	}
	if as, err := g.generateTagsIndex(dst, posts, conf); err == nil {
		result = append(result, as...)
	} else {
		return nil, err
	}
	if as, err := g.generateFeed(dst, posts, conf); err == nil {
		result = append(result, as...)
	} else {
		return nil, err
	}
	if as, err := g.generateSitemap(dst, articles, conf); err == nil {
		result = append(result, as...)
	} else {
		return nil, err
	}
	if as, err := g.generateConfig(dst, articles, conf); err == nil {
		result = append(result, as...)
	} else {
		return nil, err
	}
	return result, nil
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

func (g *IndexGenerator) generateOrderedIndex(dst fs.Writable, articles ArticleList, conf Config) (ArtifactList, error) {
	var result ArtifactList

	reversed := make(ArticleList, len(articles))
	for i, article := range articles {
		reversed[len(articles)-i-1] = article
	}
	articles = reversed

	totalPages := len(articles)/conf.Blog.PostsPerPage + 1

	tmpl, err := g.template.Load("blog/index.html")
	if err != nil {
		return nil, err
	}

	for page := 0; page < totalPages; page++ {
		targetPath := fmt.Sprintf("static/blog/%d/index.html", page+1)
		if page == 0 {
			targetPath = "static/blog/index.html"
		}

		start := page * conf.Blog.PostsPerPage
		end := page*conf.Blog.PostsPerPage + conf.Blog.PostsPerPage
		if end > len(articles) {
			end = len(articles)
		}
		posts := articles[start:end]

		result = append(result, Index{
			name:    targetPath,
			sources: posts.Sources(),
		})

		if fs.ModTime(dst, targetPath).After(posts.ModTime()) {
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

		output, err := CreateOutput(dst, targetPath, "text/html")
		if err != nil {
			return nil, err
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
			return nil, err
		}

		err = output.Close()
		if err != nil {
			return nil, err
		}
	}

	return result, nil
}

type YearlyContext struct {
	URL   string
	Image []string
	Year  int
	Posts []ArticleList
}

func (g *IndexGenerator) generateYearlyIndex(dst fs.Writable, articles ArticleList, conf Config) (ArtifactList, error) {
	var result ArtifactList

	tmpl, err := g.template.Load("blog/year.html")
	if err != nil {
		return nil, err
	}

	err = articles.GeneratePerPath(func(a Article) string {
		return a.Published.Format("static/blog/2006/index.html")
	}, func(targetPath string, articles ArticleList) error {
		posts := make([]ArticleList, 12)
		for _, p := range articles {
			month := p.Published.Month()
			posts[month-1] = append(posts[month-1], p)
		}

		result = append(result, Index{
			name:    targetPath,
			sources: articles.Sources(),
		})

		if fs.ModTime(dst, targetPath).After(articles.ModTime()) {
			return nil
		}

		output, err := CreateOutput(dst, targetPath, "text/html")
		if err != nil {
			return err
		}

		err = tmpl.Execute(output, YearlyContext{
			URL:   articles[0].Published.Format("https://blanktar.jp/blog/2006"),
			Year:  articles[0].Published.Year(),
			Posts: posts,
		})
		if err != nil {
			output.Close()
			return err
		}

		return output.Close()
	})

	return result, nil
}

type MonthlyContext struct {
	URL   string
	Image []string
	Year  int
	Month int
	Posts ArticleList
}

func (g *IndexGenerator) generateMonthlyIndex(dst fs.Writable, articles ArticleList, conf Config) (ArtifactList, error) {
	var result ArtifactList

	tmpl, err := g.template.Load("blog/month.html")
	if err != nil {
		return nil, err
	}

	articles.GeneratePerPath(func(a Article) string {
		return a.Published.Format("static/blog/2006/01/index.html")
	}, func(targetPath string, articles ArticleList) error {
		result = append(result, Index{
			name:    targetPath,
			sources: articles.Sources(),
		})

		if fs.ModTime(dst, targetPath).After(articles.ModTime()) {
			return nil
		}

		output, err := CreateOutput(dst, targetPath, "text/html")
		if err != nil {
			return err
		}

		err = tmpl.Execute(output, MonthlyContext{
			URL:   articles[0].Published.Format("https://blanktar.jp/blog/2006/01"),
			Year:  articles[0].Published.Year(),
			Month: int(articles[0].Published.Month()),
			Posts: articles,
		})
		if err != nil {
			output.Close()
			return err
		}

		return output.Close()
	})

	return result, nil
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

func (g *IndexGenerator) generateTagsIndex(dst fs.Writable, articles ArticleList, conf Config) (ArtifactList, error) {
	var result ArtifactList

	tags := make(map[string]ArticleList)

	for _, article := range articles {
		for _, tag := range article.Tags {
			if _, ok := tags[tag]; !ok {
				tags[tag] = make(ArticleList, 0)
			}
			tags[tag] = append(tags[tag], article)
		}
	}
	for tag, posts := range tags {
		reversed := make(ArticleList, len(posts))
		for i, post := range posts {
			reversed[len(posts)-i-1] = post
		}
		tags[tag] = reversed
	}

	tagPageTemplate, err := g.template.Load("blog/tagpage.html")
	if err != nil {
		return nil, err
	}

	tagIndexContext := TagIndexContext{
		URL: "https://blanktar.jp/blog/tags",
	}

	for tag, posts := range tags {
		targetPath := fmt.Sprintf("static/blog/tags/%s/index.html", EscapeTag(tag))

		tagPageContext := TagPageContext{
			URL:   fmt.Sprintf("https://blanktar.jp/blog/tags/%s", EscapeTag(tag)),
			Tag:   tag,
			Posts: posts,
		}
		tagIndexContext.Tags = append(tagIndexContext.Tags, tagPageContext)

		result = append(result, Index{
			name:    targetPath,
			sources: posts.Sources(),
		})

		if fs.ModTime(dst, targetPath).After(posts.ModTime()) {
			continue
		}

		output, err := CreateOutput(dst, targetPath, "text/html")
		if err != nil {
			return nil, err
		}

		err = tagPageTemplate.Execute(output, tagPageContext)
		if err != nil {
			output.Close()
			return nil, err
		}

		err = output.Close()
		if err != nil {
			return nil, err
		}
	}

	targetPath := "static/blog/tags/index.html"

	result = append(result, Index{
		name:    targetPath,
		sources: articles.Sources(),
	})

	if fs.ModTime(dst, targetPath).After(articles.ModTime()) {
		return result, nil
	}

	tagIndexTemplate, err := g.template.Load("blog/tagindex.html")
	if err != nil {
		return nil, err
	}

	sort.Sort(tagIndexContext.Tags)

	output, err := CreateOutput(dst, targetPath, "text/html")
	if err != nil {
		return nil, err
	}

	err = tagIndexTemplate.Execute(output, tagIndexContext)
	if err != nil {
		output.Close()
		return nil, err
	}

	return result, output.Close()
}

type FeedContext struct {
	URL       string
	Image     []string
	Generated time.Time
	Posts     ArticleList
}

func (g *IndexGenerator) generateFeed(dst fs.Writable, articles ArticleList, conf Config) (ArtifactList, error) {
	reversed := make(ArticleList, len(articles))
	for i, article := range articles {
		reversed[len(articles)-i-1] = article
	}
	articles = reversed

	targetPath := "static/blog/feed.xml"
	result := ArtifactList{Index{
		name:    targetPath,
		sources: articles.Sources(),
	}}

	if fs.ModTime(dst, targetPath).After(articles.ModTime()) {
		return result, nil
	}

	tmpl, err := g.template.Load("blog/feed.xml")
	if err != nil {
		return nil, err
	}

	output, err := CreateOutput(dst, targetPath, "application/xml")
	if err != nil {
		return nil, err
	}

	err = tmpl.Execute(output, FeedContext{
		URL:       "https://blanktar.jp/blog/feed.xml",
		Generated: time.Now(),
		Posts:     articles,
	})
	if err != nil {
		output.Close()
		return nil, err
	}

	return result, output.Close()
}

type SitemapContext struct {
	URL   string
	Image []string
	Pages []Article
}

func (g *IndexGenerator) generateSitemap(dst fs.Writable, articles ArticleList, conf Config) (ArtifactList, error) {
	as := make(ArticleList, 0, len(articles))
	for _, a := range articles {
		if !a.Hidden {
			as = append(as, a)
		}
	}

	targetPath := "static/sitemap.xml"
	result := ArtifactList{Index{
		name:    targetPath,
		sources: as.Sources(),
	}}

	if fs.ModTime(dst, targetPath).After(as.ModTime()) {
		return result, nil
	}

	tmpl, err := g.template.Load("sitemap.xml")
	if err != nil {
		return nil, err
	}

	output, err := CreateOutput(dst, targetPath, "application/xml")
	if err != nil {
		return nil, err
	}

	err = tmpl.Execute(output, SitemapContext{
		URL:   "https://blanktar.jp/sitemap.xml",
		Pages: as,
	})
	if err != nil {
		output.Close()
		return nil, err
	}

	return result, output.Close()
}

func (g *IndexGenerator) generateConfig(dst fs.Writable, as ArticleList, conf Config) (ArtifactList, error) {
	targetPath := "config.json"

	if fs.ModTime(dst, targetPath).After(as.ModTime()) {
		return nil, nil
	}

	output, err := CreateOutput(dst, targetPath, "application/json")
	if err != nil {
		return nil, err
	}
	defer output.Close()

	type Route struct {
		Src      string            `json:"src,omitempty"`
		Dest     string            `json:"dest,omitempty"`
		Handle   string            `json:"handle,omitempty"`
		Check    bool              `json:"check,omitempty"`
		Headers  map[string]string `json:"headers,omitempty"`
		Status   int               `json:"status,omitempty"`
		Continue bool              `json:"continue,omitempty"`
	}

	routes := make([]Route, 0, len(as)+len(conf.Redirects)+len(conf.Headers)+6)

	routes = append(routes, Route{
		Src: "/(.*)/",
		Headers: map[string]string{
			"Location": "/$1",
		},
		Status: 301,
	}, Route{
		Src: "/index.html",
		Headers: map[string]string{
			"Location": "/",
		},
		Status: 301,
	}, Route{
		Src: "/(.*)/index.html",
		Headers: map[string]string{
			"Location": "/$1",
		},
		Status: 301,
	})

	for _, h := range conf.Headers {
		routes = append(routes, Route{
			Src:      h.Source,
			Headers:  h.Headers,
			Continue: true,
		})
	}

	for _, a := range as {
		if len(a.Headers) == 0 {
			continue
		}

		routes = append(routes, Route{
			Src:     regexp.QuoteMeta(a.Path),
			Headers: a.Headers,
		})
	}

	routes = append(routes, Route{
		Handle: "filesystem",
	})

	for _, r := range conf.Redirects {
		routes = append(routes, Route{
			Src: r.Source,
			Headers: map[string]string{
				"Location": r.Destination,
			},
			Status: 301,
		})
	}

	routes = append(routes, Route{
		Handle: "miss",
	}, Route{
		Src: "/(.*)",
		Dest: "/404.html",
		Check: true,
		Status: 404,
	})

	err = json.NewEncoder(output).Encode(map[string]any{
		"version": 3,
		"routes":  routes,
	})
	return ArtifactList{Index{
		name:    "config.json",
		sources: as.Sources(),
	}}, err
}
