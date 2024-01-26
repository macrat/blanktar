#!/bin/sh

case "$1" in
    '' | build)
        cd builder && go run .
        ;;
    rebuild)
        rm -rf .vercel/output
        cd builder && go run .
        ;;
    serve)
        cd builder && go run . serve $2
        ;;
    dev)
        cd builder && go run . dev $2
        ;;
    prepare)
        git worktree add pages/photos photos
        ;;
    clean)
        rm -rf .vercel/output .vercel/cache
        git worktree remove pages/photos
        ;;
esac
