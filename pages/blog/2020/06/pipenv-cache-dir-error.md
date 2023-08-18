---
title: Python/Pipenvでインストールしようとした時に出るAssertionErrorやFileNotFoundErrorの直し方
pubtime: 2020-06-19T13:55:00+09:00
tags: [Python]
description: Pipenvを使ってPythonのパッケージをインストールしようとしていたところ、やたら長いトレースバックと共にAssertionErrorが出るようになってしまいました。このエラーを解決する方法についてのメモです。
faq:
  - question: "pip installしたらAssertionErrorやFileNotFoundErrorが出たときはどうしたら良い？"
    answer: "<b>PIPENV_CACHE_DIR</b>って名前の環境変数を設定すると直る、かもしれない。"
---

PipenvでPythonのパッケージをインストールしようとしたら、以下のようなやたら長いエラーが出てしまいました。

```
Locking [dev-packages] dependencies…
Locking [packages] dependencies…
Building requirements...
✘ Locking Failed!
Traceback (most recent call last):
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/resolver.py", line 807, in <module>
    main()
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/resolver.py", line 802, in main
    _main(parsed.pre, parsed.clear, parsed.verbose, parsed.system, parsed.write,
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/resolver.py", line 785, in _main
    resolve_packages(pre, clear, verbose, system, write, requirements_dir, packages)
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/resolver.py", line 746, in resolve_packages
    results, resolver = resolve(
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/resolver.py", line 728, in resolve
    return resolve_deps(
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/utils.py", line 1378, in resolve_deps
    results, hashes, markers_lookup, resolver, skipped = actually_resolve_deps(
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/utils.py", line 1093, in actually_resolve_deps
    resolver.resolve()
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/utils.py", line 808, in resolve
    results = self.resolver.resolve(max_rounds=environments.PIPENV_MAX_ROUNDS)
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/utils.py", line 796, in resolver
    self.get_resolver(clear=self.clear, pre=self.pre)
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/utils.py", line 787, in get_resolver
    constraints=self.parsed_constraints, repository=self.repository,
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/utils.py", line 780, in parsed_constraints
    self._parsed_constraints = [c for c in self.constraints]
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/utils.py", line 772, in constraints
    self.constraint_file, finder=self.repository.finder, session=self.session,
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/utils.py", line 762, in repository
    self.pip_args, use_json=False, session=self.session,
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/utils.py", line 750, in session
    self._session = self.pip_command._build_session(self.pip_options)
  File "/home/macrat/.local/lib/python3.7/site-packages/pipenv/patched/notpip/_internal/cli/req_command.py", line 83, in _build_session
    assert not options.cache_dir or os.path.isabs(options.cache_dir)
AssertionError
```

長い。すごく長い。

エラーの最後を見てみると、`assert not options.cache_dir or os.path.isabs(options.cache_dir)`というアサーションに失敗しているらしいことが分かります。
どうもキャッシュの場所がちゃんと設定されていないっぽい？

色々試していたところ、以下のようなパターンのエラーも出ました。

```
Locking [dev-packages] dependencies…
Locking [packages] dependencies…
Building requirements...
✘ Locking Failed!
Traceback (most recent call last):
  File "/home/ena/.local/lib/python3.7/site-packages/pipenv/resolver.py", line 807, in <module>
    main()
  File "/home/ena/.local/lib/python3.7/site-packages/pipenv/resolver.py", line 802, in main
    _main(parsed.pre, parsed.clear, parsed.verbose, parsed.system, parsed.write,
  File "/home/ena/.local/lib/python3.7/site-packages/pipenv/resolver.py", line 785, in _main
    resolve_packages(pre, clear, verbose, system, write, requirements_dir, packages)
  File "/home/ena/.local/lib/python3.7/site-packages/pipenv/resolver.py", line 746, in resolve_packages
    results, resolver = resolve(
  File "/home/ena/.local/lib/python3.7/site-packages/pipenv/resolver.py", line 728, in resolve
    return resolve_deps(
  File "/home/ena/.local/lib/python3.7/site-packages/pipenv/utils.py", line 1378, in resolve_deps
    results, hashes, markers_lookup, resolver, skipped = actually_resolve_deps(
  File "/home/ena/.local/lib/python3.7/site-packages/pipenv/utils.py", line 1093, in actually_resolve_deps
    resolver.resolve()
  File "/home/ena/.local/lib/python3.7/site-packages/pipenv/utils.py", line 808, in resolve
    results = self.resolver.resolve(max_rounds=environments.PIPENV_MAX_ROUNDS)
  File "/home/ena/.local/lib/python3.7/site-packages/pipenv/utils.py", line 796, in resolver
    self.get_resolver(clear=self.clear, pre=self.pre)
  File "/home/ena/.local/lib/python3.7/site-packages/pipenv/utils.py", line 788, in get_resolver
    cache=DependencyCache(environments.PIPENV_CACHE_DIR), clear_caches=clear,
  File "/home/ena/.local/lib/python3.7/site-packages/pipenv/patched/piptools/cache.py", line 66, in __init__
    os.makedirs(cache_dir)
  File "/usr/lib/python3.8/os.py", line 223, in makedirs
    mkdir(name, mode)
FileNotFoundError: [Errno 2] そのようなファイルやディレクトリはありません: ''
```

どちらにしても、キャッシュのディレクトリがおかしいというのが問題のようです。

というわけで、`PIPENV_CACHE_DIR`という環境変数を使ってキャッシュの場所を明示してみたら直りました。
以下のような設定を`~/.bashrc`あたりに入れておくと良さそうです。

``` bash
export PIPENV_CACHE_DIR=/var/tmp/pipenv-cache
```

保存先は環境に合せて設定してください。（こだわりが無ければこれでも良いはず）


---

参考: [Advanced Usage of Pipenv &#8212; pipenv 2020.6.2.dev0 documentation / ☤ Changing Pipenv’s Cache Location](https://pipenv.pypa.io/en/latest/advanced/#changing-pipenv-s-cache-location)
