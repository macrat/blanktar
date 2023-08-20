package fs_test

import (
	"bytes"
	"errors"
	"testing"
	"time"

	"github.com/macrat/blanktar/builder/fs"
)

func testFS(t *testing.T, filesystem fs.Writable) {
	t.Helper()

	// Create a file
	filename := "testfile.txt"
	content := "Hello, World!"
	writer, err := filesystem.Create(filename)
	if err != nil {
		t.Fatalf("failed to create file: %v", err)
	}

	_, err = writer.Write([]byte(content))
	if err != nil {
		t.Fatalf("failed to write to file: %v", err)
	}

	writer.Close()

	// Read the file
	reader, err := filesystem.Open(filename)
	if err != nil {
		t.Fatalf("failed to open file: %v", err)
	}

	buf := new(bytes.Buffer)
	_, err = buf.ReadFrom(reader)
	if err != nil {
		t.Fatalf("failed to read from file: %v", err)
	}

	if buf.String() != content {
		t.Errorf("expected content %q, but got %q", content, buf.String())
	}

	// Get file info
	fileInfo, err := reader.Stat()
	if err != nil {
		t.Fatalf("failed to stat file: %v", err)
	}

	if fileInfo.Name() != filename {
		t.Errorf("expected filename %q, but got %q", filename, fileInfo.Name())
	}

	if fileInfo.Size() != int64(len(content)) {
		t.Errorf("expected file size %d, but got %d", len(content), fileInfo.Size())
	}

	reader.Close()

	// Remove the file
	err = filesystem.Remove(filename)
	if err != nil {
		t.Fatalf("failed to remove file: %v", err)
	}

	// Check the file is removed
	_, err = filesystem.Open(filename)
	if !errors.Is(err, fs.ErrNotExist) {
		t.Error("file should not exist after removal")
	}
}
