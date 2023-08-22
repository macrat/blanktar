package main

// Artifact is a generated file.
type Artifact interface {
	Name() string
	Sources() SourceList
}

// ArtifactList is list of artifacts.
type ArtifactList []Artifact

func (al ArtifactList) Index(name string) int {
	for i, a := range al {
		if a.Name() == name {
			return i
		}
	}
	return -1
}

func (al *ArtifactList) Merge(bl ArtifactList) {
	for _, b := range bl {
		idx := al.Index(b.Name())
		if idx == -1 {
			*al = append(*al, b)
			continue
		}
		(*al)[idx] = b
	}
}

// Asset is a simple artifact with no extra information.
type Asset struct {
	name   string
	source Source
}

func (a Asset) Name() string {
	return a.name
}

func (a Asset) Sources() SourceList {
	return SourceList{a.source}
}

// Index is a generated index artifact from multiple sources.
type Index struct {
	name    string
	sources []Source
}

func (i Index) Name() string {
	return i.name
}

func (i Index) Sources() SourceList {
	return i.sources
}
