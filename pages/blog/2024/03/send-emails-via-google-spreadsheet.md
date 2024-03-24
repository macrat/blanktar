---
title: Googleスプレッドシートから多数のメールを予約送信する
description: Google Apps Scriptを使って、指定の時間に多数のメールを送る方法を考えてみました。Googleスプレッドシートに宛先や内容、時間の一覧を書いておくと、それに従って送信してくれるようになります。
pubtime: 2024-03-24T17:17:00+09:00
tags: [GoogleAppsScript, メール]
faq:
  - question: Google Apps Scriptでメールを送信する方法は？
    answer: |
      MailApp.sendEmail() を使うと送信できます。
      引数には "to", "cc", "bcc", "subject", "body", "attachments" などなどを含んだオブジェクトを渡すことができます。
  - question: Google Apps Scriptでスプレッドシートを読み書きする方法は？
    answer: |
      SpreadsheetApp.getActiveSheet() を使う方法が簡単です。
      得られたシートオブジェクトの sheet.getSheetValues() メソッドを使うと、シート内の値をまとめて取得することができます。
      また、 sheet.getRange().setValue() を使えば値をセットすることもできます。
  - question: Google Apps ScriptでGoogleドライブにあるファイルを開く方法は？
    answer: |
      DriveApp.getFileById() で開くことができます。
      引数のファイルIDはファイルの共有や編集のURLから取得できます。
  - question: Google Apps Scriptで使うGoogleドライブのファイルIDはどうすれば分かる？
    answer: |
      ファイルのURLが https://drive.google.com/file/d/XXXXX/view だとしたら、 XXXXX の部分がファイルIDです。
  - question: Gmailで大量のメールを予約送信する方法は？
    answer: |
      GoogleスプレッドシートとGoogle Apps Scriptを組み合わせて予約送信ツールを作っておくと簡単です。
      記事内のテンプレートを使えば、すぐにツールを使い始めることができます。
  - question: Google Apps Scriptでは一日に何通までのメールを送ることができる？
    answer: |
      メールを何通送るかではなく、メールを送る宛先の数で制限されているようです。
      無料の個人向けアカウント(@gmail.comなど)であれば一日にのべ100人まで、有料の企業向けアカウント(Google Workspace)であれば一日にのべ1,500人まで送ることができます。
  - question: Google Apps Scriptで送るメールの宛先はいくつまで設定できる？
    answer: 50人まで設定することができます。
  - question: Google Apps Scriptで送るメールに添付できるファイルのサイズは？
    answer: 一通あたりの合計が25MBまで添付することができます。
---

Gmailが使える環境で、特定の時間になったらいくつかのメールを送信する、というタスクがありました。
単発であったり数が少なかったりすれば[予約送信機能](https://support.google.com/mail/answer/9214606?hl=ja)を使えば良いのですが、毎日送信であったり宛先や文章のバリエーションが多いとそうも言っていられません。

そこで、以下のようなGoogleスプレッドシートを[Google Apps Script](https://workspace.google.co.jp/intl/ja/products/apps-script/)で読み取って自動送信するスクリプトを作ってみました。
この記事では、この仕組みの設定方法を解説します。

![送信予約のスプレッドシートの例。左から、To、CC、BCC、タイトル、本文、添付ファイル、送信予定日時、送信完了日時、の列が並んでいる。2行のメール予約が記載されており、それぞれ別の日時に、別の相手に、別のメールを送信するように予約してある。](/blog/2024/03/send-emails-via-google-spreadsheet/reservation-spreadsheet.jpg "1600x170")

沢山の人にメールを送りたいのであれば宛先の数だけ行を書けば良いだけですし、毎週や毎日送りたいのであれば送信したい日時の分だけ書いてあげればOKです。便利！


# 制約

とっても便利なGoogle Apps Scriptですが、[いくつかの割り当て制限](https://developers.google.com/apps-script/guides/services/quotas)があります。
若干ややこしいのですが、重要なところを抜き出すと（おそらく）以下のようになります。

<table>
    <tr><th></th><th>個人向け<br>(@gmail.com)</th><th>企業向け<br>(Google Workspace)</th></tr>
    <tr><th align=left>送信元のメールアドレス</th><td align=center colspan=2>自分のGmailアドレスだけ</td></tr>
    <tr><th align=left>1日に送れる宛先の数</td><td align=center>のべ100人まで</td><td align=center>のべ1,500人まで</td></tr>
    <tr><th align=left>1通のメールの宛先の数</td><td align=center colspan=2>50人まで</td></tr>
    <tr><th align=left>添付ファイルの合計容量</td><td align=center colspan=2>25MBまで</td></tr>
</table>

小規模に使う分には問題ないと思いますが、大きめの企業で一斉送信用に使おうとすると宛先の制限がネックになるかもしれませんね。

また、仕様上、送信日時にはだいたい1分以内の誤差が発生します。
秒単位でピッタリ送りたいという状況はあまり無さそうですが、もしそういった要件がある場合は別の方法を使ってください。


# やりかた

設定は以下の手順で進めます。

1. [スプレッドシートを作る](#1.+スプレッドシートを作る)
2. [権限を付与する](#2.+権限を付与する)
3. [トリガーを設定する](#3.+トリガーを設定する)
4. [スプレッドシートに予約を書く](#4.+スプレッドシートに予約を書く)


## 1. スプレッドシートを作る

まずは、予約情報を書くためのスプレッドシートを作ってスクリプトを埋め込みます。

簡単に作れるようにテンプレートを用意しておきましたので、下記のURLを開いて **「コピーを作成」** をクリックしてください。  
（テンプレートを使わずに自分でプロジェクトを設定したい場合は、[このページの末尾](#スクリプト全文)にあるスクリプトをコピーしてお使いください。）

[スプレッドシートのテンプレート (https://docs.google.com/spreadsheets/d/1s9JglBX3DEY-4ev9EYVX6PBicEmNgZOrzkt0HFYBwQU/copy)](https://docs.google.com/spreadsheets/d/1s9JglBX3DEY-4ev9EYVX6PBicEmNgZOrzkt0HFYBwQU/copy)

コピーができたら、**「To」列**の一番最初（A2セル）にあなたのメールアドレスを入力してください。
このアドレスは、次の手順で送るメールの宛先になります。


## 2. 権限を付与する

次に、以下の手順でテスト実行をして、スプレッドシートの読み取りやメール送信の権限をスクリプトに付与します。

1. ツールバーの **「拡張機能」** から **「Apps Script」** を起動します。

   ![画面上の方のツールバーの右から二番目に「拡張機能」があります。クリックして開くとメニューが現われるので、「Apps Script」を選んでクリックします。](/blog/2024/03/send-emails-via-google-spreadsheet/how-to-open-apps-script.jpg "720x110")

2. Apps Scriptの画面が表示されたら、その上にある **「実行」** ボタンをクリックします。

   ![画面上のボタンが並んでいるあたりに「実行」ボタンがあります。](/blog/2024/03/send-emails-via-google-spreadsheet/execute-apps-script-button.jpg "720x242")

3. 「承認が必要です」というダイアログが出るので、 **「権限を確認」** をクリックします。

4. 「アカウントの選択」が出たら自分のアカウントを選びます。

5. 「このアプリは Google で確認れていません」という警告が出ますが、 **「詳細を表示」** から **「メール予約一括送信（安全ではないページ）に移動」** をクリックして先に進んでください。

   ![警告ダイアログの「詳細を表示」をクリックすると「メール予約一括送信（安全ではないページ）に移動」が現われます。](/blog/2024/03/send-emails-via-google-spreadsheet/dialog-says-this-app-is-not-confirmed-by-google.jpg "320x236")

6. 実行に必要な権限として以下の3つが表示されますので、 **「許可」** をクリックしてください。

   - **Google ドライブのすべてのファイルの表示、ダウンロード**: 添付ファイルを取得するために使う権限です。
   - **Google スプレッドシートのすべてのスプレッドシートの参照、編集、作成、削除**: スプレッドシートからメールの情報を読み取るために使う権限です。
   - **ユーザー本人に代わってのメールの送信**: メールの送信に使う権限です。

7. Apps Scriptの画面に戻ると、「実行ログ」という表示が出ているはずです。  
   「実行完了」と表示されるまで待ってから、「メール予約一括送信のテスト」というタイトルのメールが届いていることを確認してください。


## 3. トリガーを設定する

権限の付与と動作テストができたら、今度はトリガー（＝定期実行のスケジュール）を設定します。


1. 画面左の目覚まし時計のようなアイコンから **「トリガー」** を開きます。

   ![画面左のメニューの中に目覚まし時計のようなアイコンの「トリガー」という項目があるので、それをクリックします。](/blog/2024/03/send-emails-via-google-spreadsheet/trigger-in-apps-script-sidebar.jpg "480x212")

2. 右下に表示される **「トリガーを追加」** をクリックします。

3. 表示されたダイアログで、以下のように設定して **「保存」** をクリックします。

   | 項目                               | 設定値             |
   |------------------------------------|--------------------|
   | 実行する関数を選択                 | sendMails          |
   | 実行するデプロイを選択             | Head               |
   | イベントのソースを選択             | 時間主導型         |
   | 時間ベースのトリガーのタイプを選択 | 分ベースのタイマー |
   | 時間の間隔を選択（分）             | 1分おき            |

   ※ 単発で使いたいだけの場合は「分ベースのタイマー」ではなく「特定の日時」にしても構いません。

3. トリガーの一覧に設定した内容が表示されたら設定完了です！


## 4. スプレッドシートに予約を書く

仕組みの準備ができたら、実際に送るメールの内容をスプレッドシートに書いてみましょう。
念のため、一度は自分のメールアドレスでテストしてみることをお勧めします。

それぞれの列は以下のような仕様になっています。

<table>
    <tr><th colspan=2>列<th>必須？</th><th>内容</th></tr>
    <tr><th>A</th><td><b>To</b></td><td align=center>必須</td><td rowspan="3">メールを送る相手のメールアドレス。<br>改行かカンマで区切って複数書けます。</td></tr>
    <tr><th>B</th><td><b>CC</b></td><td align=center>-</td></tr>
    <tr><th>C</th><td><b>BCC</b></td><td align=center>-</td></tr>
    <tr><th>D</th><td><b>タイトル</b></td><td align=center>必須</td><td>メールのタイトル。</td></tr>
    <tr><th>E</th><td><b>本文</b></td><td align=center>-</td><td>メールの本文。</td></tr>
    <tr><th>F</th><td><b>添付ファイル</b></td><td align=center>-</td><td>GoogleドライブにアップロードしたファイルのURL。添付として使われます。<br>改行かカンマで区切って複数書けます。</td></tr>
    <tr><th>G</th><td><b>送信予定日時</b></td><td align=center>必須</td><td>メールを送信したい日時。この時刻以降になるとメールが送信されます。</td></tr>
    <tr><th>H</th><td><b>送信完了日時</b></td><td align=center>(自動)</td><td>メールが送信された日時。</td></tr>
</table>

I列以降は読まないので、上記以外の情報を入れても問題ありません。
たとえばI列に相手の名前を入れておいて、E列のメール本文を `=I2 & "様  お世話になっております。"` のような計算式にしてみても良いかもしれませんね。

すべて上手くいっていれば、送信予定日時を過ぎるとメールが送られるはずです。


# スクリプト全文

[上記の手順](#1.+スプレッドシートを作る)ではテンプレートを使用しましたが、以下のスクリプトをコピー&ペーストしても同じ結果を得られます。
Apps Scriptのプロジェクトを自分で作りたい場合はこちらをお使いください。

```javascript
function sendMails() {
  const sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getLastRow() < 2) {
    return;
  }

  const values = sheet.getSheetValues(2, 1, sheet.getLastRow() - 1, 8);

  values.forEach(([to, cc, bcc, subject, body, urls, scheduled, done], i) => {
    if (!to || !subject || !scheduled || done || scheduled > new Date()) {  // ← 特徴1つめ
      return;
    }

    const attachments = urls.trim().split(/[,\n]/g).map(x => x.trim()).filter(x => x !== '').map(x => {
      const m = x.match(/^https:\/\/(?:docs|drive)\.google\.com\/[a-z]+\/d\/([a-zA-Z0-9_-]+)\/.*$/);  // ← 特徴2つめ
      if (!m) {
        throw new Error('Googleドライブ以外のファイルを添付することはできません。');
      }
      return DriveApp.getFileById(m[1]);
    });

    MailApp.sendEmail({
      to: to.replace(/[,\n]+/g, ', '),
      cc: cc.replace(/[,\n]+/g, ', '),
      bcc: bcc.replace(/[,\n]+/g, ', '),
      subject,
      body,
      attachments,
    });
    sheet.getRange(i+2, 8).setValue(new Date());
  });
}
```

これだけです。やっている内容のわりに驚くほど簡単なコードですね！
Googleサービスとの連携の楽さが流石という感じです。

**特徴1つめ**  
このスクリプトで少し特徴的なのは、特定の時間に予約送信するような機能が無いので「毎分実行して、指定時間を過ぎていたら処理する」という戦略を取っていることでしょうか。
それだけだと指定時間以降何度でも送信されてしまうので、完了日時列を作って参照することで一回しか実行されないように制御しています。

**特徴2つめ**  
添付ファイルの処理部分も癖があるというか、若干直感的ではないかもしれません。
ここでは、スプレッドシート内で指定してもらったURLからファイルIDを抜き出す処理をしています。
`https://drive.google.com/file/d/XXXXX/view` というURLのうちの `XXXXX` の部分がこのIDに相当します。

ファイルIDさえ分かれば `DriveApp.getFileById()` でオブジェクトを取得して、そのまま `MailApp.sendEmail()` の `attachments` に渡して添付することができます。なんて楽なんでしょう。


# FAQ

- **Gmailで大量のメールを予約送信する方法は？**

  GoogleスプレッドシートとGoogle Apps Scriptを組み合わせて予約送信ツールを作っておくと簡単です。
  記事内のテンプレートを使えば、すぐにツールを使い始めることができます。

- **Google Apps Scriptでは一日に何通までのメールを送ることができる？**

  メールを何通送るかではなく、メールを送る宛先の数で制限されているようです。
  無料の個人向けアカウント(@gmail.comなど)であれば一日にのべ100人まで、有料の企業向けアカウント(Google Workspace)であれば一日にのべ1,500人まで送ることができます。

- **Google Apps Scriptで送るメールの宛先はいくつまで設定できる？**

  50人まで設定することができます。

- **Google Apps Scriptで送るメールに添付できるファイルのサイズは？**

  一通あたりの合計が25MBまで添付することができます。

- **Google Apps Scriptでメールを送信する方法は？**

  [MailAppクラス](https://developers.google.com/apps-script/reference/mail/mail-app?hl=ja)の `MailApp.sendEmail()` を使うと送信できます。
  引数には "to", "cc", "bcc", "subject", "body", "attachments" などなどを含んだオブジェクトを渡すことができます。

- **Google Apps Scriptでスプレッドシートを読み書きする方法は？**

  [SpreadsheetAppクラス](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app?hl=ja)の `SpreadsheetApp.getActiveSheet()` を使う方法が簡単です。

  得られたシートオブジェクトの `getSheetValues()` メソッドを使うと、シート内の値をまとめて取得することができます。

  また、 `getRange().setValue()` を使えば値をセットすることもできます。

- **Google Apps ScriptでGoogleドライブにあるファイルを開く方法は？**

  [DriveAppクラス](https://developers.google.com/apps-script/reference/drive/drive-app?hl=ja)の `DriveApp.getFileById()` で開くことができます。
  引数のファイルIDはファイルの共有や編集のURLから取得できます。

- **Google Apps Scriptで使うGoogleドライブのファイルIDはどうすれば分かる？**

  ファイルのURLが `https://drive.google.com/file/d/XXXXX/view` だとしたら、 `XXXXX` の部分がファイルIDです。


# 参考

- [Google Apps Scriptで指定時刻にメールを送信するシステムを作ってみた - Qiita](https://qiita.com/KentoDodo/items/4839af8700742a646cea)
- [Google サービスの割り当て | Apps Script](https://developers.google.com/apps-script/guides/services/quotas)
- [Class MailApp | Apps Script](https://developers.google.com/apps-script/reference/mail/mail-app?hl=ja)
- [Class SpreadsheetApp | Apps Script](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app?hl=ja)
- [Class DriveApp | Apps Script](https://developers.google.com/apps-script/reference/drive/drive-app?hl=ja)
