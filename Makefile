.PHONY: build rebuild serve dev prepare clean

build:
	cd builder && go run .
	mkdir -p .vercel/output/functions
	cp -r functions/* .vercel/output/functions/

rebuild:
	-rm -rf .vercel/output/
	make build

serve:
	cd builder && go run . serve ${PORT}

dev:
	cd builder && go run . dev ${PORT}

prepare:
	-git worktree add pages/photos photos
	-cd functions/log.func && npm ci

clean:
	-rm -rf .vercel/output/ .vercel/cache/
	git worktree remove pages/photos
