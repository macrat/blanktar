.PHONEY: build rebuild serve preview prepare clean

build:
	cd builder && go run .

rebuild:
	-rm -rf ./dist
	cd builder && go run .

serve:
	cd builder && go run . serve

preview:
	cd builder && go run . preview

prepare:
	git worktree add pages/photos photos

clean:
	-rm -rf ./dist
	git worktree remove pages/photos
