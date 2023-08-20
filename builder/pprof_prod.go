//go:build !pprof

package main

func startProfiler() func() {
	return func() {}
}
