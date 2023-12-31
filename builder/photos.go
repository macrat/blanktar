package main

import (
	"fmt"
	"path"
	"sort"
	"strings"
	"time"

	"github.com/macrat/blanktar/builder/fs"
	"github.com/macrat/blanktar/builder/image"
)

var IMAGE_SIZES = []int{2560, 1920, 1024, 640, 320}
var THUMBNAIL_SIZES = []int{1280, 960, 640, 320, 160}

type Photo struct {
	name   string
	source Source

	Size           int
	OriginalPath   string
	VariantPathes  map[int]string
	ThumbnailPaths map[int]string
	Metadata       image.Metadata
}

func (p Photo) Name() string {
	return p.name
}

func (p Photo) Sources() SourceList {
	return SourceList{p.source}
}

type PhotoConverter struct {
}

func (c PhotoConverter) Convert(dst fs.Writable, src Source, conf Config) (ArtifactList, error) {
	if !strings.HasPrefix(src.Name(), "photos/") || !strings.HasSuffix(src.Name(), ".jpg") {
		return nil, ErrUnsupportedFormat
	}

	img, err := c.loadImage(src)
	if err != nil {
		return nil, err
	}

	meta, err := img.Metadata()
	if err != nil {
		fmt.Println("failed to load metadata:", err)
		return nil, err
	}

	if meta.LensModel == "R-Adapter M" {
		meta.LensMake = "unknown"
		meta.LensModel = "unknown"
		if err := img.SetLens("unknown", "unknown", 0, image.RationalZero); err != nil {
			return nil, err
		}
	}

	if err := img.SetArtist("SHIDA Yuma (aka. MacRat)", meta.DateTime.Format("(c)2006 MacRat")); err != nil {
		return nil, err
	}

	targetName := fmt.Sprintf("photos/%d/%s", meta.DateTime.Year(), path.Base(src.Name()))
	variants := make(map[int]string)
	thumbnails := make(map[int]string)

	var artifacts ArtifactList
	addArtifact := func(name string, size int) {
		artifacts = append(artifacts, Photo{
			name:           name,
			source:         src,
			OriginalPath:   targetName,
			VariantPathes:  variants,
			ThumbnailPaths: thumbnails,
			Size:           size,
			Metadata:       meta,
		})
	}

	srcModTime := src.ModTime()

	addArtifact(targetName, 0)
	if err := c.saveImage(dst, targetName, img, srcModTime); err != nil {
		return nil, err
	}

	for _, size := range IMAGE_SIZES {
		targetName := fmt.Sprintf("photos/%d/%s-%d.jpg", meta.DateTime.Year(), path.Base(src.Name())[0:len(path.Base(src.Name()))-4], size)
		variants[size] = targetName
		addArtifact(targetName, size)
		if err := c.saveCompactImage(dst, targetName, img, size, srcModTime); err != nil {
			return nil, err
		}
	}

	for _, size := range THUMBNAIL_SIZES {
		targetName := fmt.Sprintf("photos/%d/%s-s%d.jpg", meta.DateTime.Year(), path.Base(src.Name())[0:len(path.Base(src.Name()))-4], size)
		thumbnails[size] = targetName
		addArtifact(targetName, size)
		if err := c.saveThumbnail(dst, targetName, img, size, srcModTime); err != nil {
			return nil, err
		}
	}

	return artifacts, nil
}

func (c PhotoConverter) loadImage(src Source) (*image.Image, error) {
	f, err := src.Open()
	if err != nil {
		return nil, err
	}
	defer f.Close()

	img, err := image.Load(f)
	if err != nil {
		return nil, err
	}

	return img, nil
}

func (c PhotoConverter) saveImage(dst fs.Writable, name string, img *image.Image, srcModTime time.Time) error {
	if fs.ModTime(dst, name).After(srcModTime) {
		return nil
	}

	f, err := CreateOutput(dst, name, "image/jpeg")
	if err != nil {
		return err
	}
	defer f.Close()

	return img.SaveAsIs(f)
}

func (c PhotoConverter) saveCompactImage(dst fs.Writable, name string, img *image.Image, size int, srcModTime time.Time) error {
	if fs.ModTime(dst, name).After(srcModTime) {
		return nil
	}

	f, err := CreateOutput(dst, name, "image/jpeg")
	if err != nil {
		return err
	}
	defer f.Close()

	return img.SaveCompact(f, size, 75)
}

func (c PhotoConverter) saveThumbnail(dst fs.Writable, name string, img *image.Image, size int, srcModTime time.Time) error {
	if fs.ModTime(dst, name).After(srcModTime) {
		return nil
	}

	f, err := CreateOutput(dst, name, "image/jpeg")
	if err != nil {
		return err
	}
	defer f.Close()

	return img.SaveThumbnail(f, size, 75)
}

type PhotoList []Photo

func (l PhotoList) Len() int {
	return len(l)
}

func (l PhotoList) Less(i, j int) bool {
	return l[i].Metadata.DateTime.After(l[j].Metadata.DateTime)
}

func (l PhotoList) Swap(i, j int) {
	l[i], l[j] = l[j], l[i]
}

type PhotoGenerator struct {
	template *TemplateLoader
}

func (g PhotoGenerator) Generate(dst fs.Writable, artifacts ArtifactList, conf Config) (ArtifactList, error) {
	var photos PhotoList
	for _, a := range artifacts {
		if p, ok := a.(Photo); ok && p.Size == 0 {
			photos = append(photos, p)
		}
	}
	sort.Sort(photos)

	var pages []PhotoPageContext
	var result ArtifactList

	var err error
	if pages, err = g.generateDetailPages(dst, photos, conf); err == nil {
		for _, p := range pages {
			result = append(result, p)
		}
	} else {
		return nil, err
	}
	if as, err := g.generateIndexPages(dst, pages, conf); err == nil {
		result = append(result, as...)
	} else {
		return nil, err
	}

	return result, nil
}

type PhotoPageContext struct {
	targetPath string
	source     Source

	URL            string
	Path           string
	ImagePath      string
	VariantPathes  map[int]string
	ThumbnailPaths map[int]string

	Metadata image.Metadata

	Older []PhotoPageContext
	Newer []PhotoPageContext
}

func (c PhotoPageContext) Name() string {
	return c.targetPath
}

func (c PhotoPageContext) Sources() SourceList {
	return SourceList{c.source}
}

type PhotoPageContextList []PhotoPageContext

func (l PhotoPageContextList) Len() int {
	return len(l)
}

func (l PhotoPageContextList) Less(i, j int) bool {
	return l[i].Metadata.DateTime.After(l[j].Metadata.DateTime)
}

func (l PhotoPageContextList) Swap(i, j int) {
	l[i], l[j] = l[j], l[i]
}

func (g PhotoGenerator) generateDetailPages(dst fs.Writable, photos PhotoList, conf Config) ([]PhotoPageContext, error) {
	var contexts []PhotoPageContext

	for _, p := range photos {
		externalPath := fmt.Sprintf("photos/%d/%s", p.Metadata.DateTime.Year(), path.Base(p.Name())[0:len(path.Base(p.Name()))-4])

		contexts = append(contexts, PhotoPageContext{
			targetPath: externalPath + "/index.html",
			source:     p.source,

			URL:            fmt.Sprintf("https://blanktar.jp/%s", externalPath),
			Path:           externalPath,
			ImagePath:      p.OriginalPath,
			VariantPathes:  p.VariantPathes,
			ThumbnailPaths: p.ThumbnailPaths,

			Metadata: p.Metadata,
		})
	}

	for i := range contexts {
		if i < len(contexts)-1 {
			contexts[i].Newer = contexts[i+1 : i+7]
		}

		left := i - 6
		if left < 0 {
			left = 0
		}
		contexts[i].Older = contexts[left:i]
	}

	tmpl, err := g.template.Load("photos/detail.html")
	if err != nil {
		return nil, err
	}

	for _, c := range contexts {
		if fs.ModTime(dst, c.targetPath).After(c.source.ModTime()) {
			continue
		}

		f, err := CreateOutput(dst, c.targetPath, "text/html")
		if err != nil {
			return nil, err
		}
		defer f.Close()

		if err := tmpl.Execute(f, c); err != nil {
			return nil, err
		}
	}

	return contexts, nil
}

type PhotoIndexPageContext struct {
	targetPath string

	PageName string

	URL  string
	Path string

	Pages PhotoPageContextList
}

func (c PhotoIndexPageContext) Name() string {
	return c.targetPath
}

func (c PhotoIndexPageContext) Sources() SourceList {
	var sources SourceList
	for _, p := range c.Pages {
		sources = append(sources, p.source)
	}
	return sources
}

func (g PhotoGenerator) generateIndexPages(dst fs.Writable, pages PhotoPageContextList, conf Config) (ArtifactList, error) {
	contexts := map[string]*PhotoIndexPageContext{
		"photos": {
			targetPath: "photos/index.html",

			PageName: "photos",
			URL:      "https://blanktar.jp/photos",
			Path:     "photos",
		},
	}

	for _, p := range pages {
		externalPath := fmt.Sprintf("photos/%d", p.Metadata.DateTime.Year())

		if _, ok := contexts[externalPath]; !ok {
			contexts[externalPath] = &PhotoIndexPageContext{
				targetPath: externalPath + "/index.html",

				PageName: fmt.Sprintf("%d年の写真", p.Metadata.DateTime.Year()),
				URL:      fmt.Sprintf("https://blanktar.jp/%s", externalPath),
				Path:     externalPath,
			}
		}

		contexts[externalPath].Pages = append(contexts[externalPath].Pages, p)
		contexts["photos"].Pages = append(contexts["photos"].Pages, p)
	}

	for _, c := range contexts {
		sort.Sort(c.Pages)
	}
	contexts["photos"].Pages = contexts["photos"].Pages[:60]

	tmpl, err := g.template.Load("photos/index.html")
	if err != nil {
		return nil, err
	}

	var as ArtifactList

	for _, c := range contexts {
		if fs.ModTime(dst, c.targetPath).After(c.Sources().ModTime()) {
			continue
		}

		f, err := CreateOutput(dst, c.targetPath, "text/html")
		if err != nil {
			return nil, err
		}
		defer f.Close()

		if err := tmpl.Execute(f, c); err != nil {
			return nil, err
		}

		as = append(as, c)
	}

	return as, nil
}
