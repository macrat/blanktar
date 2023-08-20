package fs

import (
	"bytes"
	"io"
	"io/fs"
	"path"
	"time"
)

type InMemory struct {
	files map[string]*InMemoryFile
	dirs  map[string]time.Time
}

func NewInMemory() *InMemory {
	return &InMemory{
		files: map[string]*InMemoryFile{},
		dirs:  map[string]time.Time{},
	}
}

func (s *InMemory) Open(name string) (fs.File, error) {
	name = path.Clean(name)
	if t, ok := s.dirs[name]; ok {
		return &InMemoryFileReader{name: name, modTime: t}, nil
	}
	if f, ok := s.files[name]; ok {
		return f.GetReader(), nil
	}
	return nil, fs.ErrNotExist
}

func (s *InMemory) MkdirAll(name string) {
	for name != "." && name != "/" {
		s.dirs[name] = time.Now()
		name = path.Dir(name)
	}
}

func (s *InMemory) Create(name string) (io.WriteCloser, error) {
	name = path.Clean(name)
	s.MkdirAll(path.Dir(name))
	f := &InMemoryFile{name: name}
	s.files[name] = f
	return f, nil
}

func (s *InMemory) Remove(name string) error {
	_, dok := s.dirs[name]
	_, fok := s.files[name]
	if !dok && !fok {
		return fs.ErrNotExist
	}

	delete(s.files, name)
	delete(s.dirs, name)
	return nil
}

type InMemoryFile struct {
	name    string
	buf     bytes.Buffer
	modTime time.Time
}

func (f *InMemoryFile) Write(p []byte) (n int, err error) {
	return f.buf.Write(p)
}

func (f *InMemoryFile) Close() error {
	f.modTime = time.Now()
	return nil
}

func (f *InMemoryFile) GetReader() *InMemoryFileReader {
	return &InMemoryFileReader{
		name:    f.name,
		modTime: f.modTime,
		r:       bytes.NewReader(f.buf.Bytes()),
	}
}

type InMemoryFileReader struct {
	name    string
	modTime time.Time
	r       *bytes.Reader
}

func (f *InMemoryFileReader) Stat() (fs.FileInfo, error) {
	return f, nil
}

func (f *InMemoryFileReader) Read(p []byte) (n int, err error) {
	return f.r.Read(p)
}

func (f *InMemoryFileReader) Close() error {
	return nil
}

func (f *InMemoryFileReader) Name() string {
	return f.name
}

func (f *InMemoryFileReader) Size() int64 {
	if f.r == nil {
		return 0
	} else {
		return f.r.Size()
	}
}

func (f *InMemoryFileReader) Mode() fs.FileMode {
	if f.IsDir() {
		return fs.ModeDir | 0755
	} else {
		return 0644
	}
}

func (f *InMemoryFileReader) ModTime() time.Time {
	return f.modTime
}

func (f *InMemoryFileReader) IsDir() bool {
	return f.r == nil
}

func (f *InMemoryFileReader) Sys() any {
	return nil
}
