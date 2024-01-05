package main

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"
)

type AssetCache interface {
	Create(w io.Writer, key string, hash []byte, fallback func(io.Writer) error) error
	Tidy() error
}

var ErrCacheMiss = errors.New("cache miss")

type FileAssetCache struct {
	path string
}

func NewFileAssetCache(path string) (FileAssetCache, error) {
	if err := os.MkdirAll(path, 0755); err != nil {
		return FileAssetCache{}, err
	}

	return FileAssetCache{path}, nil
}

func (c FileAssetCache) calcPrefix(key string, hash []byte) string {
	h := sha256.New()
	h.Write(hash)
	h.Write([]byte(key))
	raw := hex.EncodeToString(h.Sum(nil))
	return filepath.Join(raw[:2], raw[2:])
}

func (c FileAssetCache) ForceOpen(key string, hash []byte) (io.ReadCloser, error) {
	prefix := c.calcPrefix(key, hash)

	fs, err := os.ReadDir(filepath.Join(c.path, prefix[:2]))
	if errors.Is(err, os.ErrNotExist) {
		return nil, ErrCacheMiss
	} else if err != nil {
		return nil, err
	}

	for _, f := range fs {
		if f.Name()[:len(prefix)-3] == prefix[3:] {
			oldName := filepath.Join(c.path, prefix[:2], f.Name())
			newName := filepath.Join(c.path, fmt.Sprintf("%s-%d", prefix, time.Now().Unix()))

			if err := os.Rename(oldName, newName); err != nil {
				return nil, err
			}

			return os.Open(newName)
		}
	}

	return nil, ErrCacheMiss
}

type teeWriteCloser struct {
	w  io.Writer
	wc io.WriteCloser
}

func (t teeWriteCloser) Write(p []byte) (int, error) {
	_, err := t.w.Write(p)
	if err != nil {
		return 0, err
	}

	return t.wc.Write(p)
}

func (t teeWriteCloser) Close() error {
	return t.wc.Close()
}

func (c FileAssetCache) ForceCreate(w io.Writer, key string, hash []byte) (io.WriteCloser, error) {
	prefix := c.calcPrefix(key, hash)
	name := fmt.Sprintf("%s-%d", prefix, time.Now().Unix())

	if err := os.MkdirAll(filepath.Join(c.path, prefix[:2]), 0755); err != nil {
		return nil, err
	}

	f, err := os.Create(filepath.Join(c.path, name))

	return teeWriteCloser{
		w:  w,
		wc: f,
	}, err
}

func (c FileAssetCache) Create(w io.Writer, key string, hash []byte, fallback func(io.Writer) error) error {
	if r, err := c.ForceOpen(key, hash); err == nil {
		defer r.Close()
		if _, err := io.Copy(w, r); err != nil {
			return err
		}
		return nil
	} else if !errors.Is(err, ErrCacheMiss) {
		return err
	}

	f, err := c.ForceCreate(w, key, hash)
	if err != nil {
		return err
	}
	defer f.Close()

	return fallback(f)
}

func (c FileAssetCache) Tidy() error {
	fs, err := os.ReadDir(c.path)
	if err != nil {
		return err
	}

	var errs []error

	now := time.Now().Unix()

	for _, f := range fs {
		if f.IsDir() {
			continue
		}

		var t int64
		fmt.Sscanf(f.Name(), "%s-%d", nil, &t)

		if t < now-30*24*60*60 {
			err := os.Remove(filepath.Join(c.path, f.Name()))
			if err != nil {
				errs = append(errs, err)
			}
		}
	}

	return errors.Join(errs...)
}
