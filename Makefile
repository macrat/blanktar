.PHONEY: build rebuild preview

build:
	cd builder && go run .

rebuild:
	-rm -rf ./dist
	cd builder && go run .

preview:
	cd builder && go run . preview
