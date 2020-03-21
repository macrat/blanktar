#!/usr/bin/python
#coding:utf-8
#
#		親愛なる変態に捧ぐ、
#			あくいあるかべがみ。
#
#						MIT License (c)2013 MacRat
#
#
#	ブートすると、日付に応じた壁紙を作成、設定します。
#	リアルタイムにしたい場合はスタートアップやバッチファイルあたりを使ってください。
#

import datetime
import random

from ctypes import windll
import win32con

from PIL import Image, ImageDraw, ImageFont


LABEL = '{} days'  # 表示する文字のテンプレート。
WALLPAPER_PATH = 'c:\\wallpaper.bmp'  # 出力する壁紙のパス。フルパス限定。unicode型もおっけー。
BASE_DATE = datetime.date(2014, 1, 18)  # カウントダウンが0になる日付。

FONT_FILE = 'Arial.ttf'  # フォント名。truetypeのやつで。
FONT_SIZE = 36  # 基準になるフォントサイズ。


# 画面サイズ。win apiで取得するので、基本的にいじる必要はなし。
WIDTH = windll.user32.GetSystemMetrics(0)
HEIGHT = windll.user32.GetSystemMetrics(1)


def ChangeWallpaper(fname):
	if isinstance(fname, unicode):
		fname = fname.encode('cp932')
	windll.user32.SystemParametersInfoA(win32con.SPI_SETDESKWALLPAPER, 0, fname, win32con.SPIF_UPDATEINIFILE)

def CreateWallpaper(label, date, fname):
	delta = date - datetime.date.today()

	text = label.format(delta.days)

	fontsize = FONT_SIZE
	if 0 < delta.days:
		if delta.days <= 90:
			fontsize *= 1.1
		if delta.days <= 60:
			fontsize *= 1.1
		if delta.days <= 30:
			fontsize *= 1.1
		if delta.days <= 14:
			fontsize *= 1 + (14 - delta.days) * 0.1
	fontsize = int(fontsize)

	img = Image.new('L', (WIDTH, HEIGHT), 0)
	draw = ImageDraw.Draw(img)

	for i in range(300):
		draw.line(((random.randint(0, WIDTH), 0), (random.randint(0, WIDTH), HEIGHT)), random.randint(0, 128), random.randint(1, 2))

	font = ImageFont.truetype(FONT_FILE, fontsize)
	txtsize = draw.textsize(text, font)
	draw.text((WIDTH/2 - txtsize[0]/2, HEIGHT/2 - txtsize[1]/2), text, font=font, fill=255)

	for i in range(30):
		draw.line(((random.randint(0, WIDTH), 0), (random.randint(0, WIDTH), HEIGHT)), random.randint(0, 128), random.randint(1, 2))

	img.save(fname)

if __name__ == '__main__':
	CreateWallpaper(LABEL, BASE_DATE, WALLPAPER_PATH)
	ChangeWallpaper(WALLPAPER_PATH)
