#coding:utf-8
#
#		ビープ音で演奏するやつ。
#
#	周波数の参考: http://asrite.blog.fc2.com/blog-entry-229.html
#
#						MIT License (c)2013 MacRat

from winsound import Beep
from time import sleep

BASE = 500

sound = sorted((
	(u'ド', 523),
	(u'レ', 587),
	(u'ミ', 659),
	(u'ファ', 698),
	(u'ソ', 784),
	(u'ラ', 880),
	(u'シ', 932),
), key=lambda x: len(x[0]), reverse=True)

def Play(l):
	while l:
		for name, key in sound:
			if l.startswith(' '):
				l = l[1:]
				print
				sleep(BASE/1000.0)
			if l.startswith(name):
				l = l[len(name):]

				time = 1
				while l.startswith(u'ー'):
					l = l[1:]
					time += 1

				print name + u'ー'*(time-1)
				Beep(key, BASE*time)
				break
		else:
			l = l[1:]

if __name__ == '__main__':
	#Play(u'ドレミファソラシ')
	Play(u'ドレミーレド ドレミレドレー')
