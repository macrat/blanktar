package main_test

import (
	"errors"
	"io"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/macrat/blanktar/builder"
)

func CountFiles(t *testing.T, path string) int {
	t.Helper()

	n := 0
	filepath.Walk(path, func(path string, info os.FileInfo, err error) error {
		if !info.IsDir() {
			n++
		}
		return nil
	})
	return n
}

func TestFileAssetCache(t *testing.T) {
	t.Parallel()

	cacheDir := t.TempDir()
	outDir := t.TempDir()

	cache, err := main.NewFileAssetCache(cacheDir)
	if err != nil {
		t.Fatalf("failed to create cache: %s", err)
	}

	f, err := os.Create(filepath.Join(outDir, "test.txt"))
	if err != nil {
		t.Fatalf("failed to create file: %s", err)
	}
	err = cache.Create(f, "test.txt", []byte("test"), func(w io.Writer) error {
		_, err := w.Write([]byte("hello world"))
		return err
	})
	if err != nil {
		t.Fatalf("failed to create cache: %s", err)
	}
	f.Close()

	if n := CountFiles(t, cacheDir); n != 1 {
		t.Errorf("unexpected number of files in cache: %d", n)
	}

	if err = os.Remove(filepath.Join(outDir, "test.txt")); err != nil {
		t.Fatalf("failed to remove test file: %s", err)
	}

	f, err = os.Create(filepath.Join(outDir, "test.txt"))
	if err != nil {
		t.Fatalf("failed to create file: %s", err)
	}
	err = cache.Create(f, "test.txt", []byte("test"), func(w io.Writer) error {
		return errors.New("should not be called")
	})
	if err != nil {
		t.Fatalf("failed to create cache: %s", err)
	}
	f.Close()

	if n := CountFiles(t, cacheDir); n != 1 {
		t.Errorf("unexpected number of files in cache: %d", n)
	}

	read, err := os.ReadFile(filepath.Join(outDir, "test.txt"))
	if err != nil {
		t.Fatalf("failed to read file: %s", err)
	}

	if string(read) != "hello world" {
		t.Errorf("unexpected file content: %s", read)
	}

	if err = cache.Tidy(time.Now().Add(-time.Hour)); err != nil {
		t.Fatalf("failed to tidy cache: %s", err)
	}
	if n := CountFiles(t, cacheDir); n != 1 {
		t.Errorf("unexpected number of files in cache: %d", n)
	}

	if err = cache.Tidy(time.Now().Add(time.Hour)); err != nil {
		t.Fatalf("failed to tidy cache: %s", err)
	}
	if n := CountFiles(t, cacheDir); n != 0 {
		t.Errorf("unexpected number of files in cache: %d", n)
	}
}
