package image

import (
	"bytes"
	"io"
)

func asReadSeeker(r io.Reader) io.ReadSeeker {
	if rs, ok := r.(io.ReadSeeker); ok {
		return rs
	}
	data, err := io.ReadAll(r)
	if err != nil {
		return errorReadSeeker{err: err}
	}
	return bytes.NewReader(data)
}

type errorReadSeeker struct {
	err error
}

func (e errorReadSeeker) Read(p []byte) (n int, err error) {
	return 0, e.err
}

func (e errorReadSeeker) Seek(offset int64, whence int) (int64, error) {
	return 0, e.err
}
