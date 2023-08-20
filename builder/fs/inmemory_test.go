package fs_test

import (
	"testing"

	"github.com/macrat/blanktar/builder/fs"
)

func TestInMemory(t *testing.T) {
	testFS(t, fs.NewInMemory())
}
