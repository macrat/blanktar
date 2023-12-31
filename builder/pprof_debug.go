//go:build pprof

package main

import (
	"os"
	"runtime/pprof"
)

func startProfiler() func() {
	f, err := os.Create("cpu.pprof")
	if err != nil {
		panic(err)
	}
	if err := pprof.StartCPUProfile(f); err != nil {
		panic(err)
	}
	return func() {
		pprof.StopCPUProfile()
	}
}
