.PHONEY: build rebuild prepare preview clean

build:
	cd builder && go run .

rebuild:
	-rm -rf ./dist
	cd builder && go run .

preview:
	cd builder && go run . preview

prepare:
	git worktree add pages/photos photos

clean:
	-rm -rf ./dist
	git worktree remove pages/photos
