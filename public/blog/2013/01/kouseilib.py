#!/usr/bin/python
#coding:utf-8
#
#		kouseilib
#	Yahoo APIの校正支援APIを使う為のラッパー的なもの。
#
#
# Spellcheck(appid, string, [filter, mask])
#   yahoo APIにクエリを投げて、帰ってきたものをパースして返却します。
#   appidにはyahooのアプリケーションID、stringには校正対象のテキストを渡してください。
#   filterはfilter_groupに、maskはno_filterにあたります。リストまたはタプルで渡してください。
#
# Proofread(appid, string, [filter, mask])
#   校正した文を返します
#   引数はSpellcheckと同じです
#
# Ruby(appid, string, [grade, start, end])
#   おまけ。渡された文にルビを振ります。Yahoo APIのルビ振りAPIを使わせて頂きました。
#   gradeには1-8の数字を渡してください。小学校n年生相当の漢字にルビを振ります。
#   （7は中学生以上で習う漢字、8は常用漢字以外にルビを振ります）
#   start / end はルビの開始/終了に挟む記号を指定します。デフォルトではstart='(', end=')'になっています。
#
#				License: MIT License
#				Copyright: (c)2013 MacRat

import sys
import urllib
import xml.etree.ElementTree as xml


KOUSEI_NAMESPACE = '{urn:yahoo:jp:jlp:KouseiService}'
FURIGANA_NAMESPACE = '{urn:yahoo:jp:jlp:FuriganaService}'


def Proofread(appid, string, filter=None, mask=None):
	results = Spellcheck(appid, string, filter, mask)

	shift = 0
	ret = string
	for result in results:
		if result['ShitekiWord']:
			ret = ret[:result['StartPos'] + shift] + result['ShitekiWord'] + ret[result['EndPos'] + shift:]
			shift += len(result['ShitekiWord']) - result['Length']

	if ret != string:
		return ret


def Spellcheck(appid, string, filter=None, mask=None):
	query  = 'http://jlp.yahooapis.jp/KouseiService/V1/kousei?'
	query += 'appid=' + appid + '&'
	if isinstance(filter, list) or isinstance(filter, tuple):
		query += 'filter_group=' + ','.join([str(x) for x in set(filter)]) + '&'
	if isinstance(mask, list) or isinstance(mask, tuple):
		query += 'no_filter=' + ','.join([str(x) for x in set(mask)]) + '&'
	query += 'sentence=' + urllib.quote(string.encode('utf-8'))

	recv = urllib.urlopen(query).read()
	data = xml.fromstring(recv)

	results = []
	for result in list(data):
		startPos = int(result.findtext(KOUSEI_NAMESPACE + 'StartPos'))
		length = int(result.findtext(KOUSEI_NAMESPACE + 'Length'))
		endPos = startPos + length
		surface = result.findtext(KOUSEI_NAMESPACE + 'Surface')
		shitekiWord = result.findtext(KOUSEI_NAMESPACE + 'ShitekiWord')
		shitekiInfo = result.findtext(KOUSEI_NAMESPACE + 'ShitekiInfo')

		results.append({
			'StartPos': startPos,
			'EndPos': endPos,
			'Length': length,
			'Surface': surface,
			'ShitekiWord': shitekiWord,
			'ShitekiInfo': shitekiInfo,
		})

	return results


def Ruby(appid, string, grade=1, start='(', end=')'):
	query  = 'http://jlp.yahooapis.jp/FuriganaService/V1/furigana?'
	query += 'appid=' + appid + '&'
	if grade and grade >= 1 and grade <= 8:
		query += 'grade=' + str(grade) + '&'
	query += 'sentence=' + urllib.quote(string.encode('utf-8'))

	recv = urllib.urlopen(query).read()
	data = xml.fromstring(recv)

	ret = string
	for result in list(list(list(data)[0])[0]):
		src = result.findtext(FURIGANA_NAMESPACE + 'Surface')
		dst = result.findtext(FURIGANA_NAMESPACE + 'Furigana')

		if src and dst:
			dst = src + start + dst + end
			ret = ret.replace(src, dst)

	return ret


if __name__ == '__main__':
	if len(sys.argv) <= 2:
		print(u'yahoo APIを使用した日本語文の校正プログラムです。')
		print(u'')
		print(u'kouseilib.py [yahoo API アプリケーションID] 校正対象の文')
		sys.exit(1)

	arg = ' '.join(sys.argv[2:])
	for enc in ('cp932', 'utf-8', 'euc-jp', 'iso-2022-jp'):
		try:
			arg = arg.decode(enc)
			break
		except:
			pass

	ret = Proofread(sys.argv[1], arg)
	if ret:
		print(ret)
	else:
		print(u'校正の必要はありません')
		sys.exit(-1)
