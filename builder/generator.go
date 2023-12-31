package main

import (
	"github.com/macrat/blanktar/builder/fs"
)

// Generator generates multiple artifacts from multiple sources.
type Generator interface {
	Generate(fs.Writable, ArtifactList, Config) (ArtifactList, error)
}

// GeneratorSet is a generator that generates by multiple generators.
type GeneratorSet []Generator

func (g GeneratorSet) Generate(dst fs.Writable, artifacts ArtifactList, config Config) (ArtifactList, error) {
	var as ArtifactList
	for _, gen := range g {
		var err error
		a, err := gen.Generate(dst, artifacts, config)
		if err != nil {
			return nil, err
		}
		as = append(as, a...)
	}
	return as, nil
}
