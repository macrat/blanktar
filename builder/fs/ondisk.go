package fs

import (
	"io"
	"io/fs"
	"os"
	"path/filepath"
)

type OnDisk struct {
	path string
}

func NewOnDisk(path string) *OnDisk {
	return &OnDisk{path}
}

func (s *OnDisk) Open(name string) (fs.File, error) {
	return os.Open(filepath.Join(s.path, name))
}

func (s *OnDisk) Create(name string) (io.WriteCloser, error) {
	if err := os.MkdirAll(filepath.Dir(filepath.Join(s.path, name)), 0755); err != nil {
		return nil, err
	}
	return os.Create(filepath.Join(s.path, name))
}

func (s *OnDisk) Remove(name string) error {
	return os.Remove(filepath.Join(s.path, name))
}
