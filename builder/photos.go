package main

import (
	"fmt"
	"path"
	"strings"
	"time"

	"github.com/macrat/blanktar/builder/fs"
	"github.com/macrat/blanktar/builder/image"
)

type Photo struct {
	name   string
	source Source

	Size     int
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
		if err := img.SetLens("unknown", "unknown", 0, image.RationalZero); err != nil {
			return nil, err
		}
	}

	if err := img.SetArtist("SHIDA Yuma (aka. MacRat)", meta.DateTime.Format("(c)2006 MacRat")); err != nil {
		return nil, err
	}

	var artifacts ArtifactList
	addArtifact := func(name string, size int) {
		artifacts = append(artifacts, Photo{
			name:     name,
			source:   src,
			Size:     size,
			Metadata: meta,
		})
	}

	srcModTime := src.ModTime()

	targetName := fmt.Sprintf("photos/%d/%02d/%s", meta.DateTime.Year(), meta.DateTime.Month(), path.Base(src.Name()))
	addArtifact(targetName, 0)
	if err := c.saveImage(dst, targetName, img, srcModTime); err != nil {
		return nil, err
	}

	for _, size := range []int{1920, 1024, 640, 320} {
		targetName := fmt.Sprintf("photos/%d/%02d/%s-%d.jpg", meta.DateTime.Year(), meta.DateTime.Month(), path.Base(src.Name())[0:len(path.Base(src.Name()))-4], size)
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
