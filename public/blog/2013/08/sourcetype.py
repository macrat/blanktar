#!/usr/bin/python
#coding:utf-8
#
#			SourceType
#
#	ソースコードの言語をそれなりの確率で判定する。
#
#					(c)2013 MacRat

import re
import codeop

def IsPython(source):
	source = '\n'.join(line for line in source.splitlines() if not line.startswith('#')).strip()
	if not source:
		return False
	if source.startswith('>>> ') or source.startswith('def ') or source.startswith('import '):
		return True
	try:
		codeop.compile_command(source)
		return True
	except (SyntaxError, ValueError, OverflowError):
		return False

def IsShell(source):
	if re.match('#!/(usr/)?bin/(ba)?sh\n', source):
		return True
	for line in source.splitlines():
		if not line.startswith('# '):
			break
	else:
		return False
	if source.startswith('$ ') or source.startswith('# '):
		return True
	return False

def IsScheme(source):
	if source.startswith('#!/usr/bin/gosh\n'):
		return True
	if re.match('^((\\(([^ \t]+?[ \n\t]*)+\\))+[ \t\n]*)+$', source, re.DOTALL):
		return True
	return False

def IsHTML(source):
	if source.startswith('<!DOCTYPE html>\n'):
		return True
	if re.match('^(</?[a-zA-Z][a-zA-Z0-9]*( .*)*>.*?)+$', source, re.DOTALL):
		return True
	return False

def IsCSS(source):
	if re.match('@charset "(utf-8|shift-jis|euc-jp)";\n', source):
		return True
	if re.match('^([#.]?[a-zA-Z0-9-_,.: ]*{.*})+$', source, re.DOTALL):
		return True
	return False

def IsC(source):
	if re.match('#include +<.*?\\.h>\n', source):
		return True
	return False

def IsJavascript(source):
	if re.search('function [a-zA-Z0-9_]+\\([a-zA-Z0-9]+(, *[a-zA-Z0-9]+)*\\) *{.*}', source, re.DOTALL):
		return True
	return False

def SourceType(source):
	if IsPython(source):
		return 'python'
	elif IsShell(source):
		return 'shell'
	elif IsScheme(source):
		return 'scheme'
	elif IsHTML(source):
		return 'html'
	elif IsCSS(source):
		return 'css'
	elif IsC(source):
		return 'c'
	elif IsJavascript(source):
		return 'javascript'

if __name__ == '__main__':
	while True:
		import os
		src = raw_input('>>> ')
		if src.startswith('"') and src.endswith('"'):
			src = src[1:-1]
		if os.path.exists(src):
			print SourceType(open(src).read())
