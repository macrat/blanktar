package fs_test

import (
	"testing"

	"github.com/macrat/blanktar/builder/fs"
)

func TestOnDisk(t *testing.T) {
	testFS(t, fs.NewOnDisk(t.TempDir()))
}
