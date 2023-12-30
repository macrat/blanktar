package image

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"io"
	"strings"
	"time"

	"github.com/dsoprea/go-exif/v3"
	exifcommon "github.com/dsoprea/go-exif/v3/common"
	exifundefined "github.com/dsoprea/go-exif/v3/undefined"
	"github.com/dsoprea/go-jpeg-image-structure/v2"
	"golang.org/x/image/draw"
)

type Image struct {
	sl   *jpegstructure.SegmentList
	root *exif.IfdBuilder
	img  image.Image
}

func Load(r io.Reader) (*Image, error) {
	rs := asReadSeeker(r)

	jmp := jpegstructure.NewJpegMediaParser()

	size, err := rs.Seek(0, io.SeekEnd)
	if err != nil {
		return nil, err
	}
	_, err = rs.Seek(0, io.SeekStart)
	if err != nil {
		return nil, err
	}

	intfc, err := jmp.Parse(rs, int(size))
	if err != nil {
		return nil, err
	}

	sl := intfc.(*jpegstructure.SegmentList)

	root, err := sl.ConstructExifBuilder()
	if err != nil {
		return nil, err
	}

	_, err = rs.Seek(0, io.SeekStart)
	if err != nil {
		return nil, err
	}
	img, err := jpeg.Decode(r)
	if err != nil {
		return nil, err
	}

	return &Image{
		sl:   sl,
		root: root,
		img:  img,
	}, nil
}

func (i *Image) SaveAsIs(w io.Writer) error {
	return i.sl.Write(w)
}

func (i *Image) saveImage(w io.Writer, quality int, img image.Image) error {
	var buf bytes.Buffer

	err := jpeg.Encode(&buf, img, &jpeg.Options{
		Quality: quality,
	})
	if err != nil {
		return err
	}

	jmp := jpegstructure.NewJpegMediaParser()

	intfc, err := jmp.Parse(bytes.NewReader(buf.Bytes()), int(buf.Len()))
	if err != nil {
		return err
	}

	sl := intfc.(*jpegstructure.SegmentList)

	err = sl.SetExif(i.root)
	if err != nil {
		return err
	}

	return sl.Write(w)
}

func (i *Image) SaveCompact(w io.Writer, maxSize, quality int) error {
	img := resizeImage(i.img, maxSize)
	return i.saveImage(w, quality, img)
}

func resizeImage(img image.Image, maxSize int) image.Image {
	width := img.Bounds().Max.X
	height := img.Bounds().Max.Y

	if width > maxSize || height > maxSize {
		if width > height {
			height = height * maxSize / width
			width = maxSize
		} else {
			width = width * maxSize / height
			height = maxSize
		}

		dst := image.NewRGBA(image.Rect(0, 0, width, height))
		draw.CatmullRom.Scale(dst, dst.Bounds(), img, img.Bounds(), draw.Over, nil)
		img = dst
	}

	return img
}

func (i *Image) SaveThumbnail(w io.Writer, quality int) error {
	width := i.img.Bounds().Max.X
	height := i.img.Bounds().Max.Y

	shorter := width
	if height < shorter {
		shorter = height
	}

	top := (height - shorter) / 2
	left := (width - shorter) / 2

	cropped := image.NewRGBA(image.Rect(0, 0, 320, 320))
	draw.CatmullRom.Scale(cropped, cropped.Bounds(), i.img, image.Rect(left, top, width-left, height-top), draw.Over, nil)

	return i.saveImage(w, quality, cropped)
}

func (i *Image) SetArtist(artist, copyright string) error {
	ifd, err := exif.GetOrCreateIbFromRootIb(i.root, "IFD")
	if err != nil {
		return fmt.Errorf("failed to get/create IFD: %v", err)
	}

	if err = ifd.SetStandardWithName("Artist", artist); err != nil {
		return fmt.Errorf("failed to set Artist: %v", err)
	}

	if err = ifd.SetStandardWithName("Copyright", copyright); err != nil {
		return fmt.Errorf("failed to set Copyright: %v", err)
	}

	err = i.sl.SetExif(i.root)
	if err != nil {
		return fmt.Errorf("failed to set EXIF: %v", err)
	}

	return nil
}

func (i *Image) SetLens(maker, model string, focalLength int, maxAperture Rational) error {
	exif, err := exif.GetOrCreateIbFromRootIb(i.root, "IFD/Exif")
	if err != nil {
		return fmt.Errorf("failed to get/create IFD/Exif: %v", err)
	}

	if err = exif.SetStandardWithName("LensMake", maker); err != nil {
		return fmt.Errorf("failed to set LensMake: %v", err)
	}

	if err = exif.SetStandardWithName("LensModel", model); err != nil {
		return fmt.Errorf("failed to set LensModel: %v", err)
	}

	if err = exif.SetStandardWithName("FocalLength", []exifcommon.Rational{{
		Numerator:   uint32(focalLength),
		Denominator: 1,
	}}); err != nil {
		return fmt.Errorf("failed to set FocalLength: %v", err)
	}

	if err = exif.SetStandardWithName("MaxApertureValue", []exifcommon.Rational{exifcommon.Rational(maxAperture)}); err != nil {
		return fmt.Errorf("failed to set MaxApertureValue: %v", err)
	}

	err = i.sl.SetExif(i.root)
	if err != nil {
		return fmt.Errorf("failed to set EXIF: %v", err)
	}

	return nil
}

func (i *Image) Metadata() (Metadata, error) {
	_, _, tags, err := i.sl.DumpExif()
	if err != nil {
		return Metadata{}, err
	}

	m := Metadata{
		Width: i.img.Bounds().Max.X,
		Height: i.img.Bounds().Max.Y,
		AspectRatio: float64(i.img.Bounds().Max.X) / float64(i.img.Bounds().Max.Y),
	}

	var description, usercomment, comment string

	for _, t := range tags {
		switch t.TagName {
		case "DateTimeOriginal":
			m.DateTime, err = time.Parse("2006:01:02 15:04:05", t.Value.(string))

		case "Make":
			m.Make = strings.TrimSpace(t.Value.(string))
		case "Model":
			m.Model = strings.TrimSpace(t.Value.(string))

		case "LensMake":
			m.LensMake = strings.TrimSpace(t.Value.(string))
		case "LensModel":
			m.LensModel = strings.TrimSpace(t.Value.(string))

		case "Artist":
			m.Artist = strings.TrimSpace(t.Value.(string))
		case "Copyright":
			m.Copyright = strings.TrimSpace(t.Value.(string))

		case "ExposureTime":
			m.ExposureTime = Rational(t.Value.([]exifcommon.Rational)[0])
		case "ApertureValue":
			m.ApertureValue = Rational(t.Value.([]exifcommon.Rational)[0]).Float()
		case "ISOSpeedRatings":
			m.ISOSpeedRatings = t.Value.([]uint16)[0]

		case "ImageDescription":
			description = strings.TrimSpace(t.Value.(string))
		case "UserComment":
			usercomment = strings.TrimSpace(string(t.Value.(exifundefined.Tag9286UserComment).EncodingBytes))
		}

		if err != nil {
			return Metadata{}, err
		}
	}

	if usercomment != "" {
		m.Comment = usercomment
	} else if description != "" {
		m.Comment = description
	} else if comment != "" {
		m.Comment = comment
	}

	return m, nil
}

type Metadata struct {
	DateTime time.Time

	Make  string
	Model string

	LensMake  string
	LensModel string

	Artist    string
	Copyright string

	ExposureTime    Rational
	ApertureValue   float64
	ISOSpeedRatings uint16

	Width int
	Height int
	AspectRatio float64

	Comment string
}

type Rational exifcommon.Rational

var (
	RationalZero = Rational{
		Numerator:   0,
		Denominator: 1,
	}
)

func (r Rational) String() string {
	return fmt.Sprintf("%d/%d", r.Numerator, r.Denominator)
}

func (r Rational) Float() float64 {
	return float64(r.Numerator) / float64(r.Denominator)
}

func (r Rational) Int() int {
	return int(r.Float())
}
