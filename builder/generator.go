package main

import (
	"github.com/macrat/blanktar/builder/fs"
)

// Generator generates multiple artifacts from multiple sources.
type Generator interface {
	Generate(fs.Writable, ArtifactList, Config) (ArtifactList, error)
}
