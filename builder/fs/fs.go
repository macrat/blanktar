package fs

import (
	"io"
	"io/fs"
	"time"
)

var ErrNotExist = fs.ErrNotExist

var WalkDir = fs.WalkDir

type DirEntry = fs.DirEntry

type Readable fs.FS

type Writable interface {
	Readable

	Create(name string) (io.WriteCloser, error)
	Remove(name string) error
}

func Stat(f Readable, name string) (fs.FileInfo, error) {
	return fs.Stat(f, name)
}

func ModTime(f Readable, name string) time.Time {
	info, err := Stat(f, name)
	if err != nil {
		return time.Time{}
	}
	return info.ModTime()
}

func ReadFile(f Readable, name string) ([]byte, error) {
	file, err := f.Open(name)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	return io.ReadAll(file)
}
