---
title: pythonでローマ数字を作る
pubtime: 2014-01-19T01:36:00+09:00
amp: hybrid
tags: [Python, ローマ数字, int]
description: pythonを使って、数値をローマ数字に変換するコードを書いてみました。
---

pythonのintをローマ数字にするやつを作ってみた。
``` python
def itoroma(x):
    if not 3999 >= x >= 1:
        raise ValueError('out of range.')

    result = []

    ones = {0:'I', 1:'X', 2:'C', 3:'M'}
    fives = {0:'V', 1:'L', 2:'D'}

    for i, c in enumerate(int(y) for y in reversed(str(x))):
        try:
            one = ones[i]
            five = fives[i]
            nine = one + ones[i+1]
        except:
            pass

        if c == 4:
            result.append(one + five)
        elif c == 5:
            result.append(five)
        elif c == 6:
            result.append(five + one)
        elif c == 9:
            result.append(nine)
        elif c != 0:
            if c < 5:
                result.append(one*c)
            else:
                result.append(five + one*(c-5))

    return ''.join(reversed(result))

if __name__ == '__main__':
    for i in (0, 1, 11, 12, 14, 18, 24, 43, 99, 495, 1888, 1945, 3999, 4000):
        print i, '->',
        try:
            print itoroma(i)
        except ValueError as e:
            print e
```
こんな感じ。

if文をずらずら並べてるのがちょっと気に食わん。誰か直して。

ちなみに出力は
```
0 -> out of range.
1 -> I
11 -> XI
12 -> XII
14 -> XIV
18 -> XVIII
24 -> XXIV
43 -> XLIII
99 -> XCIX
495 -> CDXCV
1888 -> MDCCCLXXXVIII
1945 -> MCMXLV
3999 -> MMMCMXCIX
4000 -> out of range.
```
こんな感じになるはず。
