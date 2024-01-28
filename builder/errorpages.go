package main

import (
	"github.com/macrat/blanktar/builder/fs"
)

type ErrorGenerator struct {
	Template *TemplateLoader
}

func (e ErrorGenerator) Generate(dst fs.Writable, as ArtifactList, conf Config) (ArtifactList, error) {
	tmpl, err := e.Template.Load("error.html")
	if err != nil {
		return nil, err
	}

	targetPath := "static/404.html"
	assets := ArtifactList{
		Asset{
			name: targetPath,
		},
	}

	if _, err := fs.Stat(dst, targetPath); err == nil {
		return assets, nil
	}

	w, err := CreateOutput(dst, targetPath, "text/html")
	if err != nil {
		return nil, err
	}
	defer w.Close()

	err = tmpl.Execute(w, map[string]interface{}{
		"Title":       "404",
		"Description": "Not Found",
	})
	if err != nil {
		return nil, err
	}

	return assets, nil
}
