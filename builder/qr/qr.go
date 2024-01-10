package qr

import (
	"io"

	"github.com/skip2/go-qrcode"
)

func Generate(w io.Writer, size int, url string) error {
	qr, err := qrcode.New(url, qrcode.Medium)
	if err != nil {
		return err
	}
	return qr.Write(size, w)
}
