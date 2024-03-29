---
title: vimでmarkdownのfrontmatterにちゃんと色を付ける
pubtime: 2021-03-06T21:25:00+09:00
tags: [Vim, 環境構築]
image: [/blog/2021/03/vim-frontmatter-highlight.jpg]
description: vimは標準でmarkdownをシンタックスハイライトしてくれるのですが、frontmatterに対応していません。私はfrontmatterを使う機会が多いので、良い感じに表示する方法を探してみました。
---

vimは標準でmarkdownをシンタックスハイライトしてくれるのですが、frontmatterに対応していません。

frontmatterを使う機会が結構あるのですが、いつも変な見た目になって気になっていたのでちょっと綺麗にしてみました。


# 何もしなかった場合の見た目

デフォルトのvimだと、以下のような感じになってしまいます。

![frontmatterが正しく認識されず、本文+タイトル行としてハイライトしているvimのスクリーンショット](/blog/2021/03/vim-incorrect-frontmatter-highlight.jpg "800x242")

frontmatter部分もmarkdownとして認識しようとしているので、罫線と見たり見出し行として見たりして変な感じ。


# ハイライトのルールを追加する

`~/.vim/after/syntax/markdown.vim`に以下のようなファイルを作ります。

``` vim
unlet b:current_syntax
syntax include @Yaml syntax/yaml.vim
syntax region yamlFrontmatter start=/\%^---$/ end=/^---$/ keepend contains=@Yaml
```

ファイルの1行目が`---`から始まっていたら、次の`---`という行までをyamlとしてハイライトする、みたいな指示ですね。


# ちゃんとハイライトされるようになった

これを書いてあげると、以下のようにfrontmatter部分はちゃんとYAMLとして表示してくれます。

![今度はfrontmatterをきちんとハイライトしている状態のvimのスクリーンショット](/blog/2021/03/vim-correct-frontmatter-highlight.jpg "800x242")

私の場合はGitHub Flavored Markdownを使いたいので[vim-gfm-syntax](https://github.com/rhysd/vim-gfm-syntax)というプラグインで`markdown`シンタックスを上書きしているですが、それでも上記の記述だけで機能しました。良い感じ。

---

参考: [Vim and markdown frontmatter](https://habamax.github.io/2019/03/07/vim-markdown-frontmatter.html)
