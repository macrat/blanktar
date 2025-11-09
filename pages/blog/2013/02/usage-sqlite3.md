---
title: SQLite3の基本的な使い方
pubtime: 2013-02-16T02:01:00+09:00
modtime: 2025-11-09T23:33:00+09:00
tags: [データベース, SQLite]
description: SQLite3の基本的な使い方を解説します。テーブルの作成、データの追加・更新・削除、検索など、SQLの基本操作を実例とともに紹介します。
---

SQLite3は、サーバー不要で使える軽量なSQLデータベースです。データベースの保存に必要なファイルが1つだけで済むので、小規模なアプリケーションで非常に手軽に使うことができます。

この記事では、SQLite3の基本的な使い方をご紹介します。
ここではコマンドラインインターフェースを使いますが、SQLの文法はPythonなどの他の言語から使う場合もほぼ同じです。

<ins date="2013-05-02T13:19:00+09:00">

# 2013-05-02 追記

Pythonから手軽にデータベースを使いたい方にはこちらの記事もおすすめです。
[pythonのdbmモジュールを使ってみた](/blog/2013/05/python-dbm)

</ins>

# 目次

- [SQLite3の特徴](#sqlite3の特徴)
- [インストールと起動](#インストールと起動)
- [テーブルの作成](#テーブルの作成)
- [データの追加](#データの追加)
- [データの検索](#データの検索)
- [データの更新](#データの更新)
- [データの削除](#データの削除)
- [トランザクション](#トランザクション)
- [Pythonから使う](#pythonから使う)
- [まとめ](#まとめ)

<section>

# SQLite3の特徴

SQLite3には以下のような特徴があります。

- **サーバー不要**: 別途データベースサーバーを立てる必要がありません
- **ファイルベース**: データベース全体が1つのファイルに保存されます
- **軽量**: 実装がコンパクトで、組み込み用途にも適しています
- **型の柔軟性**: 動的型付けを採用しており、列に異なる型のデータを格納できます（ただし推奨はされません）
- **標準SQL対応**: 標準的なSQLの多くをサポートしています

一方で、大規模なデータや高い同時実行性が必要な場合は、PostgreSQLやMySQLなどのサーバー型データベースの方が適しています。

</section>
<section>

# インストールと起動

## インストール

**公式サイトから:**
[SQLite公式サイト](https://www.sqlite.org/download.html)から、使用環境に合ったバイナリをダウンロードします。

**パッケージマネージャを使う場合:**

```bash
# Ubuntu/Debian
sudo apt-get install sqlite3

# macOS (Homebrew)
brew install sqlite3

# Windows (Chocolatey)
choco install sqlite
```

## 起動

コマンドラインで以下のように入力します。

```bash
sqlite3
```

メモリ上に一時的なデータベースが作成されます。ファイルとして保存したい場合は、ファイル名を指定します。

```bash
sqlite3 mydata.db
```

指定したファイルが存在しない場合は、新規作成されます。

## 終了

SQLite3を終了するには、以下のコマンドを入力します。

```sql
.exit
```

または `.quit` でも終了できます。

## コメント

SQL文の中でコメント（メモ書き）を記述するには、先頭に`--`を付けます。

```sql
-- これはコメントです
SELECT * FROM test;  -- ここにもコメントが書けます
```

</section>
<section>

# テーブルの作成

データを格納するためのテーブルを作成します。

## 基本的な構文

```sql
CREATE TABLE テーブル名 (
    列名1 データ型 制約,
    列名2 データ型 制約,
    ...
);
```

## 実例

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    email TEXT UNIQUE
);
```

この例では、以下のような制約を設定しています。

- `PRIMARY KEY`: 主キー（各行を一意に識別する）
- `AUTOINCREMENT`: 自動的に連番を割り当てる
- `NOT NULL`: NULL値を許可しない
- `UNIQUE`: 重複する値を許可しない

## データ型

SQLite3の主なデータ型は以下の通りです。

- `INTEGER`: 整数
- `REAL`: 浮動小数点数
- `TEXT`: 文字列
- `BLOB`: バイナリデータ
- `NULL`: NULL値

型の指定は省略しても動作しますし、実は何なら誤った型を指定したり別の型の値を格納したりすることさえできてしまいますが、推奨される使い方ではありません。
エラーが出ないので、よく注意して使ってください。

以降の例では、シンプルなテーブルを使います。

```sql
CREATE TABLE test (key TEXT, value INTEGER);
```

</section>
<section>

# データの追加

テーブルにデータを追加します。

## 基本的な構文

```sql
INSERT INTO テーブル名 (列名1, 列名2, ...) VALUES (値1, 値2, ...);
```

列名を省略した場合は、すべての列に値を指定する必要があります。

```sql
INSERT INTO テーブル名 VALUES (値1, 値2, ...);
```

## 実例

```sql
INSERT INTO test VALUES ('abc', 123);
INSERT INTO test VALUES ('def', 456);
INSERT INTO test VALUES ('ghi', 789);
```

## 複数行の一括挿入

```sql
INSERT INTO test VALUES
    ('jkl', 100),
    ('mno', 200),
    ('pqr', 300);
```

</section>
<section>

# データの検索

テーブルからデータを取得します。`SELECT`文は非常に多機能で、様々な条件でデータを検索できます。

## すべてのデータを取得

```sql
SELECT * FROM test;
```

`*`はすべての列を意味します。

## 特定の列のみ取得

```sql
SELECT key FROM test;
```

複数の列を指定する場合はカンマで区切ります。

```sql
SELECT value, key FROM test;
```

## 条件を指定して取得

`WHERE`句を使って条件を指定します。

```sql
-- valueが100のデータ
SELECT * FROM test WHERE value = 100;

-- valueが100以上500未満のデータ
SELECT * FROM test WHERE value >= 100 AND value < 500;

-- keyが'abc'または'def'のデータ
SELECT * FROM test WHERE key = 'abc' OR key = 'def';
```

## 並べ替え

`ORDER BY`句を使って結果を並べ替えます。

```sql
-- valueの昇順（小さい順）
SELECT * FROM test ORDER BY value ASC;

-- valueの降順（大きい順）
SELECT * FROM test ORDER BY value DESC;
```

`ASC`（昇順）は省略可能です。

## 取得件数の制限

`LIMIT`句を使って取得する行数を制限します。

```sql
-- 先頭から3行
SELECT * FROM test LIMIT 3;

-- 5行目から3行分（オフセットは0始まり）
SELECT * FROM test LIMIT 3 OFFSET 5;
```

## 集計関数

### 行数をカウント

```sql
SELECT COUNT(*) FROM test;

-- 条件に一致する行数
SELECT COUNT(*) FROM test WHERE value > 100;
```

### 合計値

```sql
SELECT SUM(value) FROM test;
```

### 平均値

```sql
SELECT AVG(value) FROM test;
```

### 最大値・最小値

```sql
SELECT MAX(value) FROM test;
SELECT MIN(value) FROM test;
```

</section>
<section>

# データの更新

既存のデータを更新します。

## 基本的な構文

```sql
UPDATE テーブル名 SET 列名1 = 値1, 列名2 = 値2, ... WHERE 条件;
```

## 実例

```sql
-- keyが'abc'の行のvalueを999に更新
UPDATE test SET value = 999 WHERE key = 'abc';

-- 複数の列を同時に更新
UPDATE test SET key = 'xyz', value = 0 WHERE key = 'abc';
```

**重要**: `WHERE`句を省略すると、すべての行が更新されてしまいます。意図しない場合は注意してください。

```sql
-- すべての行のvalueを0にする
UPDATE test SET value = 0;
```

</section>
<section>

# データの削除

## 行の削除

```sql
DELETE FROM テーブル名 WHERE 条件;
```

実例：

```sql
-- keyが'abc'の行を削除
DELETE FROM test WHERE key = 'abc';
```

**重要**: `WHERE`句を省略すると、すべての行が削除されます。

```sql
-- すべての行を削除
DELETE FROM test;
```

## テーブルの削除

テーブル自体を削除する場合は`DROP TABLE`を使います。

```sql
DROP TABLE test;
```

</section>
<section>

# トランザクション

複数のSQL文をまとめて実行し、すべて成功したときだけ結果を保存する仕組みです。
たとえば、送金元口座からの引き落しと送金先口座への入金のような、どちらか一方だけが成功しては困る操作に使います。

トランザクションは以下のように使います。

```sql
BEGIN TRANSACTION;  -- トランザクションを開始

INSERT INTO test VALUES ('aaa', 100);
UPDATE test SET value = 200 WHERE key = 'bbb';
DELETE FROM test WHERE key = 'ccc';

COMMIT;  -- 変更を確定
```

エラーが発生した場合や、変更を取り消したい場合は`ROLLBACK`を使います。

```sql
BEGIN TRANSACTION;

INSERT INTO test VALUES ('aaa', 100);
-- 何か問題が発生した場合

ROLLBACK;  -- 変更を取り消し
```

</section>
<section>

# Pythonから使う

PythonにはSQLite3のサポートが標準ライブラリに含まれています。
Pythonから実行する場合は、末尾の`;`は省略できます。

```python
import sqlite3

# データベースに接続（ファイルが存在しない場合は作成される）
conn = sqlite3.connect('mydata.db')

# カーソルを作成
cursor = conn.cursor()

# テーブルを作成
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER
    )
''')

# データを挿入（プレースホルダを使用）
cursor.execute('INSERT INTO users (name, age) VALUES (?, ?)', ('Alice', 30))

# 複数行を一括挿入
users = [
    ('Bob', 25),
    ('Charlie', 35),
]
cursor.executemany('INSERT INTO users (name, age) VALUES (?, ?)', users)

# 変更を確定
conn.commit()

# データを取得
cursor.execute('SELECT * FROM users WHERE age >= ?', (30,))
results = cursor.fetchall()

for row in results:
    print(row)

# 接続を閉じる
conn.close()
```

## プレースホルダとSQLインジェクション

外部からの入力に基づいてSQL文を作りたいときは、絶対に文字列連結やフォーマットでSQL文を構築しないでください。

**悪い例**:
```python
password = input("Enter your name: ")
cursor.execute(f"SELECT * FROM users WHERE password = '{password}'")
```

このようにすると、パスワードとして`' OR '1'='1`のような文字列を入力された場合、以下のようなSQL文として実行されてしまいます。
これだと、すべてのユーザーが取得されてしまいます。

```sql
SELECT * FROM users WHERE password = '' OR '1'='1'
```

このような悪意のあるSQL文を含んだ入力をする攻撃のことを**SQLインジェクション**と呼びます。

SQL文を安全に組み立てられるように、**プレースホルダ**という機能を使って以下のように記述してください。

**良い例**:
```python
password = input("Enter your name: ")
cursor.execute("SELECT * FROM users WHERE password = ?", [password])
```

この書き方であれば、`password`にどんな値が入っていてもSQLインジェクションの問題は発生しません。

</section>
<section>

# ファイルの保存

コマンドラインで起動時にファイル名を指定した場合、変更は自動的にファイルに保存されます。

```bash
sqlite3 mydata.db
```

メモリ上のデータベース（ファイル名なしで起動した場合）の内容をファイルに保存するには、`.backup`コマンドを使います。

```sql
.backup mydata.db
```

逆に、ファイルからメモリ上のデータベースに読み込むには、`.restore`コマンドを使います。

```sql
.restore mydata.db
```

</section>

# まとめ

この記事では、SQLite3の基本的な使い方を紹介しました。

- **テーブルの作成**: `CREATE TABLE`
- **データの追加**: `INSERT INTO`
- **データの検索**: `SELECT`（条件指定、並べ替え、集計など）
- **データの更新**: `UPDATE`
- **データの削除**: `DELETE`、`DROP TABLE`
- **トランザクション**: `BEGIN`、`COMMIT`、`ROLLBACK`

SQLite3は、これ以外にも多くの機能を持っています。
より詳しい情報は、[SQLite公式ドキュメント](https://www.sqlite.org/docs.html)を参照してください。

データベースは、データを効率的に管理するための強力なツールです。小規模なアプリケーションから始めて、徐々に機能を学んでいくことをおすすめします。
