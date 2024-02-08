package main

import (
	"fmt"
	"strings"
	"testing"

	"github.com/google/go-cmp/cmp"
)

func TestHoistingHTML(t *testing.T) {
	tests := []struct {
		source string
		output string
	}{
		{
			source: strings.Join([]string{
				`<!DOCTYPE html>`,
				`<html>`,
				`	<head>`,
				`		<meta charset="utf-8">`,
				`		<title>Hoisting</title>`,
				`		<script src="script.js"></script>`,
				`		<script src="https://example.com/lib/script.js"></script>`,
				`	</head>`,
				`	<body>`,
				`		<h1>Hoisting</h1>`,
				`		<p>Hoisting for HTML!</p>`,
				`	</body>`,
				`</html>`,
			}, "\n"),
			output: strings.Join([]string{
				`<!DOCTYPE html><html><head>`,
				`		<meta charset="utf-8"/>`,
				`		<title>Hoisting</title>`,
				`		<script src="script.js"></script>`,
				`		<script src="https://example.com/lib/script.js"></script>`,
				`	</head>`,
				`	<body>`,
				`		<h1>Hoisting</h1>`,
				`		<p>Hoisting for HTML!</p>`,
				`	`,
				`</body></html>`,
			}, "\n"),
		},
		{
			source: strings.Join([]string{
				`<!DOCTYPE html>`,
				`<html>`,
				`	<head>`,
				`		<meta charset="utf-8">`,
				`		<title>Hoisting</title>`,
				`		<script>`,
				`			console.log("hello");`,
				`		</script>`,
				`		<style>`,
				`body {`,
				`  background-color: #fff;`,
				`}`,
				`		</style>`,
				`	</head>`,
				`	<body>`,
				`		<h1>Hoisting</h1>`,
				`		<p>Hoisting for HTML!</p>`,
				`		<style>`,
				`p {`,
				`  color: #000;`,
				`}`,
				`		</style>`,
				`		<script>`,
				`			console.log("world!");`,
				`		</script>`,
				`	</body>`,
				`</html>`,
			}, "\n"),
			output: strings.Join([]string{
				`<!DOCTYPE html><html><head>`,
				`		<meta charset="utf-8"/>`,
				`		<title>Hoisting</title>`,
				`		`,
				`		`,
				`	<style>`,
				`body {`,
				`  background-color: #fff;`,
				`}`,
				`		`,
				``,
				`p {`,
				`  color: #000;`,
				`}`,
				`		</style></head>`,
				`	<body>`,
				`		<h1>Hoisting</h1>`,
				`		<p>Hoisting for HTML!</p>`,
				`		`,
				`		`,
				`	`,
				`<script>`,
				`			console.log("hello");`,
				`		`,
				`;`,
				``,
				`			console.log("world!");`,
				`		</script></body></html>`,
			}, "\n"),
		},
		{
			source: strings.Join([]string{
				`<!DOCTYPE html>`,
				`<html>`,
				`	<head>`,
				`		<meta charset="utf-8">`,
				`		<title>Hoisting</title>`,
				`		<script src="script.js"></script>`,
				`		<script src="https://example.com/lib/script.js"></script>`,
				`		<script>`,
				`			console.log("hello");`,
				`		</script>`,
				`		<style>`,
				`body {`,
				`  background-color: #fff;`,
				`}`,
				`		</style>`,
				`	</head>`,
				`	<body>`,
				`		<h1>Hoisting</h1>`,
				`		<p>Hoisting for HTML!</p>`,
				`		<style>`,
				`p {`,
				`  color: #000;`,
				`}`,
				`		</style>`,
				`		<script>`,
				`			console.log("world!");`,
				`		</script>`,
				`	</body>`,
				`</html>`,
			}, "\n"),
			output: strings.Join([]string{
				`<!DOCTYPE html><html><head>`,
				`		<meta charset="utf-8"/>`,
				`		<title>Hoisting</title>`,
				`		<script src="script.js"></script>`,
				`		<script src="https://example.com/lib/script.js"></script>`,
				`		`,
				`		`,
				`	<style>`,
				`body {`,
				`  background-color: #fff;`,
				`}`,
				`		`,
				``,
				`p {`,
				`  color: #000;`,
				`}`,
				`		</style></head>`,
				`	<body>`,
				`		<h1>Hoisting</h1>`,
				`		<p>Hoisting for HTML!</p>`,
				`		`,
				`		`,
				`	`,
				`<script>`,
				`			console.log("hello");`,
				`		`,
				`;`,
				``,
				`			console.log("world!");`,
				`		</script></body></html>`,
			}, "\n"),
		},
	}

	for i, test := range tests {
		t.Run(fmt.Sprint(i), func(t *testing.T) {
			var output strings.Builder
			err := HoistingHTML(&output, strings.NewReader(test.source))
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if diff := cmp.Diff(test.output, output.String()); diff != "" {
				t.Errorf("output mismatch (-want +got):\n%s", diff)
			}
		})
	}
}
