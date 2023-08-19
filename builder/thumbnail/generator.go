package thumbnail

import (
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"io"
	"os"

	"github.com/golang/freetype/truetype"
	"golang.org/x/image/font"
	"golang.org/x/image/math/fixed"
)

func readFont(name string) (*truetype.Font, error) {
	fontBytes, err := os.ReadFile(name)
	if err != nil {
		return nil, err
	}
	font, err := truetype.Parse(fontBytes)
	if err != nil {
		return nil, err
	}
	return font, nil
}

func drawBackgroundRuler(img draw.Image, fg color.Color, bg color.Color) {
	draw.Draw(
		img,
		img.Bounds(),
		image.NewUniform(bg),
		image.ZP,
		draw.Src,
	)

	for y := 0; y < img.Bounds().Dy(); y += 48 {
		draw.Draw(
			img,
			image.Rect(0, y, img.Bounds().Dx(), y+1),
			image.NewUniform(fg),
			image.ZP,
			draw.Src,
		)
	}

	for x := 0; x < img.Bounds().Dx(); x += 48 {
		draw.Draw(
			img,
			image.Rect(x, 0, x+1, img.Bounds().Dy()),
			image.NewUniform(fg),
			image.ZP,
			draw.Src,
		)
	}
}

// drawStringInBox draws text in a box.
// The text will be aligned to the left, and place center vertically.
// If the text is too long, it will wrap to next line.
//
// Returns the bounding box of the text.
func drawStringInBox(img draw.Image, box image.Rectangle, face font.Face, c color.Color, text string) image.Rectangle {
	d := &font.Drawer{
		Dst:  img,
		Src:  image.NewUniform(c),
		Face: face,
		Dot:  fixed.Point26_6{},
	}

	var lines []string
	var start int

	runes := []rune(text)
	for i := 0; i < len(runes); i++ {
		width := d.MeasureString(string(runes[start:i]))
		if width > fixed.I(box.Dx()) {
			i--

			if 'A' <= runes[i] && runes[i] <= 'Z' || 'a' <= runes[i] && runes[i] <= 'z' {
				for j := i - 1; j >= start; j-- {
					if runes[j] == ' ' || !('A' <= runes[j] && runes[j] <= 'Z' || 'a' <= runes[j] && runes[j] <= 'z') {
						i = j + 1
						break
					}
				}
				lines = append(lines, string(runes[start:i]))
				start = i
			} else {
				for i < len(runes) && (runes[i] == '、' || runes[i] == '。' || runes[i] == '！' || runes[i] == '？' || runes[i] == '）' || runes[i] == '」' || runes[i] == 'ー') {
					i++
				}
				for i > 0 && (runes[i-1] == '（' || runes[i-1] == '「') {
					i--
				}
				lines = append(lines, string(runes[start:i]))
				start = i
			}
		}
	}
	if d.MeasureString(string(runes[start:])) > fixed.I(box.Dx()) {
		lines = append(lines, string(runes[start:len(runes)-1]))
		lines = append(lines, string(runes[len(runes)-1:]))
	} else {
		lines = append(lines, string(runes[start:]))
	}

	mergin := fixed.I(2)
	height := fixed.I(len(lines)).Mul(face.Metrics().Height + mergin)
	top := fixed.I(box.Min.Y+24) + (fixed.I(box.Dy())-height)/2
	for i, line := range lines {
		d.Dot.X = fixed.I(box.Min.X)
		d.Dot.Y = top + fixed.I(i).Mul(face.Metrics().Height+mergin)
		d.DrawString(line)
	}

	return image.Rect(box.Min.X, (top - face.Metrics().Height).Floor(), box.Max.X, (top + height).Ceil())
}

// drawString draws text on top of line.
func drawString(img draw.Image, pos image.Point, face font.Face, c color.Color, text string) {
	d := &font.Drawer{
		Dst:  img,
		Src:  image.NewUniform(c),
		Face: face,
		Dot:  fixed.P(pos.X, pos.Y),
	}
	d.DrawString(text)
}

func drawTags(img draw.Image, pos image.Point, face font.Face, fg color.Color, bg color.Color, texts []string) {
	d := &font.Drawer{
		Dst:  img,
		Src:  image.NewUniform(fg),
		Face: face,
	}

	var offset fixed.Int26_6

	for i := len(texts) - 1; i >= 0; i-- {
		text := texts[i]

		w := d.MeasureString(text)

		b := image.Rect(
			pos.X-(offset+w).Floor()-10,
			pos.Y-face.Metrics().Height.Ceil()-8,
			pos.X-offset.Ceil(),
			pos.Y+8,
		)
		draw.Draw(img, b, image.NewUniform(bg), image.ZP, draw.Src)

		d.Dot.X = fixed.I(pos.X-6) - offset - w
		d.Dot.Y = fixed.I(pos.Y - 4)
		d.DrawString(text)

		offset += fixed.I(b.Dx() + 12)
	}
}

type Generator struct {
	regular  *truetype.Font
	semibold *truetype.Font
}

func NewGenerator(regularFontPath, semiBoldFontPath string) (Generator, error) {
	regular, err := readFont(regularFontPath)
	if err != nil {
		return Generator{}, err
	}
	semibold, err := readFont(semiBoldFontPath)
	if err != nil {
		return Generator{}, err
	}

	return Generator{
		regular:  regular,
		semibold: semibold,
	}, nil
}

func (g Generator) Generate(dst io.Writer, title string, tags []string) error {
	img := image.NewRGBA(image.Rect(0, 0, 1200, 630))

	drawBackgroundRuler(img, color.Gray{0xe6}, color.Gray{0xf9})

	titleBox := drawStringInBox(
		img,
		image.Rect((1200-600)/2, 30/2, (1200-600)/2+600, 600+30),
		truetype.NewFace(g.semibold, &truetype.Options{
			Size: 58,
		}),
		color.RGBA{0x44, 0x33, 0x33, 0xff},
		title,
	)

	drawString(
		img,
		image.Point{titleBox.Min.X + 24, titleBox.Min.Y},
		truetype.NewFace(g.regular, &truetype.Options{
			Size: 32,
		}),
		color.RGBA{0x44, 0x33, 0x33, 0xff},
		"Blanktar.jp",
	)

	drawTags(
		img,
		image.Point{(1200-600)/2 + 600, titleBox.Max.Y},
		truetype.NewFace(g.regular, &truetype.Options{
			Size: 24,
		}),
		color.RGBA{0xf9, 0xf9, 0xf9, 0xff},
		color.RGBA{0x44, 0x33, 0x33, 0xff},
		tags,
	)

	return png.Encode(dst, img)
}
