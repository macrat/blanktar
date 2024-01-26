.PHONEY: build rebuild serve preview prepare clean

build:
	cd builder && go run .

rebuild:
	-rm -rf ./.vercel/output
	cd builder && go run .

serve:
	cd builder && go run . serve

preview:
	cd builder && go run . preview

prepare:
	git worktree add pages/photos photos

clean:
	-rm -rf ./.vercel/output ./.vercel/cache
	git worktree remove pages/photos
