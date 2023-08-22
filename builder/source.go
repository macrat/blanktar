package main

import (
	"io"
	"path"
	"time"

	"github.com/macrat/blanktar/builder/fs"
)

// Source is a file in source file system.
type Source struct {
	name string
	fs   fs.Readable
}

func (s Source) Name() string {
	return s.name
}

func (s Source) String() string {
	return s.name
}

func (s Source) Open() (fs.File, error) {
	return s.fs.Open(s.name)
}

func (s Source) ModTime() time.Time {
	return fs.ModTime(s.fs, s.name)
}

func (s Source) ReadAll() ([]byte, error) {
	f, err := s.Open()
	if err != nil {
		return nil, err
	}
	defer f.Close()
	return io.ReadAll(f)
}

type SourceList []Source

func (s SourceList) Includes(name string) bool {
	for _, source := range s {
		if source.name == name {
			return true
		}
	}
	return false
}

// ModTime returns latest modified time of sources.
func (s SourceList) ModTime() time.Time {
	if len(s) == 0 {
		return time.Time{}
	}

	latestModTime := s[0].ModTime()
	for _, source := range s {
		if source.ModTime().After(latestModTime) {
			latestModTime = source.ModTime()
		}
	}
	return latestModTime
}

type WalkSourcesFunc func(Source) error

func WalkSources(f fs.Readable, fn WalkSourcesFunc) error {
	return fs.WalkDir(f, ".", func(name string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() && path.Base(name)[0] != '.' {
			fn(Source{name, f})
		}
		return nil
	})
}
