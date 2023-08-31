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

var IMAGE_SIZES = []int{1920, 1024, 640, 320}

type Photo struct {
	name   string
	source Source

	Size     int
	OriginalPath string
	VariantPathes map[int]string
	Metadata image.Metadata
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

	var artifacts ArtifactList
	addArtifact := func(name string, size int) {
		variants[size] = name
		artifacts = append(artifacts, Photo{
			name:     name,
			source:   src,
			OriginalPath: targetName,
			VariantPathes: variants,
			Size:     size,
			Metadata: meta,
		})
	}

	srcModTime := src.ModTime()

	addArtifact(targetName, 0)
	if err := c.saveImage(dst, targetName, img, srcModTime); err != nil {
		return nil, err
	}

	for _, size := range IMAGE_SIZES {
		targetName := fmt.Sprintf("photos/%d/%s-%d.jpg", meta.DateTime.Year(), path.Base(src.Name())[0:len(path.Base(src.Name()))-4], size)
		addArtifact(targetName, size)
		if err := c.saveCompactImage(dst, targetName, img, size, srcModTime); err != nil {
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

type PhotoList []Photo

func (l PhotoList) Len() int {
	return len(l)
}

func (l PhotoList) Less(i, j int) bool {
	return l[i].Metadata.DateTime.Before(l[j].Metadata.DateTime)
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

	var result ArtifactList

	if as, err := g.generateDetailPages(dst, photos, conf); err == nil {
		result = append(result, as...)
	} else {
		return nil, err
	}
	/*
	if as, err := g.generateIndexPages(dst, photos, conf); err == nil {
		result = append(result, as...)
	} else {
		return nil, err
	}
	*/

	return result, nil
}

type PhotoPageContext struct {
	targetPath string
	source     Source

	URL  string
	Path string
	ImagePath string
	VariantPathes map[int]string

	Metadata image.Metadata

	Older []PhotoPageContext
	Newer []PhotoPageContext
}

func (g PhotoGenerator) generateDetailPages(dst fs.Writable, photos PhotoList, conf Config) (ArtifactList, error) {
	var contexts []PhotoPageContext

	for _, p := range photos {
		externalPath := fmt.Sprintf("photos/%d/%s", p.Metadata.DateTime.Year(), path.Base(p.Name())[0:len(path.Base(p.Name()))-4])

		contexts = append(contexts, PhotoPageContext{
			targetPath: externalPath + "/index.html",
			source:     p.source,

			URL:           fmt.Sprintf("https://blanktar.jp/%s", externalPath),
			Path:          externalPath,
			ImagePath:     p.OriginalPath,
			VariantPathes: p.VariantPathes,
			// TODO: add original image with actual size
			// TODO: use width rather than height even if the image is portrait

			Metadata: p.Metadata,
		})
	}

	for i := range contexts {
		if i < len(contexts)-1 {
			contexts[i].Newer = contexts[i+1 : i+7]
		}

		left := i-6
		if left < 0 {
			left = 0
		}
		contexts[i].Older = contexts[left : i]
	}

	tmpl, err := g.template.Load("photos/detail.html")
	if err != nil {
		return nil, err
	}

	var as ArtifactList

	for _, c := range contexts {
		f, err := CreateOutput(dst, c.targetPath, "text/html")
		if err != nil {
			return nil, err
		}
		defer f.Close()

		if err := tmpl.Execute(f, c); err != nil {
			return nil, err
		}

		as = append(as, Asset{
			name:   c.targetPath,
			source: c.source,
		})
	}

	return as, nil
}
