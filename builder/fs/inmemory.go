package fs

import (
	"bytes"
	"io"
	"io/fs"
	"path"
	"sync"
	"time"
)

type InMemory struct {
	sync.RWMutex

	files map[string]*InMemoryFile
	dirs  map[string]time.Time
}

func NewInMemory() *InMemory {
	return &InMemory{
		files: make(map[string]*InMemoryFile),
		dirs: map[string]time.Time{
			".": time.Now(),
		},
	}
}

func (s *InMemory) Open(name string) (fs.File, error) {
	s.RLock()
	defer s.RUnlock()

	name = path.Clean(name)
	if t, ok := s.dirs[name]; ok {
		var children []fs.DirEntry
		for n, c := range s.files {
			if path.Dir(n) == name {
				children = append(children, fs.FileInfoToDirEntry(c.getReader()))
			}
		}
		for n, t := range s.dirs {
			if n != name && path.Dir(n) == name {
				children = append(children, fs.FileInfoToDirEntry(&InMemoryFileReader{
					name:    n,
					modTime: t,
				}))
			}
		}
		return &InMemoryFileReader{
			name:     name,
			modTime:  t,
			children: children,
		}, nil
	}
	if f, ok := s.files[name]; ok {
		return f.getReader(), nil
	}
	return nil, fs.ErrNotExist
}

func (s *InMemory) mkdirAll(name string) {
	for name != "." && name != "/" {
		s.dirs[name] = time.Now()
		name = path.Dir(name)
	}
}

func (s *InMemory) Create(name string) (io.WriteCloser, error) {
	s.Lock()
	defer s.Unlock()

	name = path.Clean(name)
	s.mkdirAll(path.Dir(name))
	f := &InMemoryFile{name: name}
	s.files[name] = f
	return f, nil
}

func (s *InMemory) Remove(name string) error {
	s.Lock()
	defer s.Unlock()

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
	sync.Mutex

	name    string
	buf     bytes.Buffer
	modTime time.Time
}

func (f *InMemoryFile) Write(p []byte) (n int, err error) {
	f.Lock()
	defer f.Unlock()

	return f.buf.Write(p)
}

func (f *InMemoryFile) Close() error {
	f.Lock()
	defer f.Unlock()

	f.modTime = time.Now()
	return nil
}

func (f *InMemoryFile) getReader() *InMemoryFileReader {
	return &InMemoryFileReader{
		name:    f.name,
		modTime: f.modTime,
		r:       bytes.NewReader(f.buf.Bytes()),
	}
}

type InMemoryFileReader struct {
	sync.Mutex

	name     string
	modTime  time.Time
	r        *bytes.Reader
	children []fs.DirEntry
}

func (f *InMemoryFileReader) Stat() (fs.FileInfo, error) {
	return f, nil
}

func (f *InMemoryFileReader) Read(p []byte) (n int, err error) {
	if f.r == nil {
		return 0, fs.ErrInvalid
	}

	f.Lock()
	defer f.Unlock()

	return f.r.Read(p)
}

func (f *InMemoryFileReader) Seek(offset int64, whence int) (int64, error) {
	if f.r == nil {
		return 0, fs.ErrInvalid
	}

	f.Lock()
	defer f.Unlock()

	return f.r.Seek(offset, whence)
}

func (f *InMemoryFileReader) ReadDir(n int) ([]fs.DirEntry, error) {
	if !f.IsDir() {
		return nil, fs.ErrInvalid
	}
	return f.children, nil
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
