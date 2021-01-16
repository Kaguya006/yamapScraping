# yamapScraping

## 詳細
yamap(登山者向けサイト)に対してスクレイピングを行う

登山予定の山について、「気になるワード」を発言しているユーザーの活動日記を、いち早く特定するためのスクレイピングツール。

## 実行方法
`node yamap.js 山名 キーワード1 キーワード2 ... .. .`

- 山名を好きなワードに設定して、山名以外での検索からのスクライピングも可能です。
- キーワード数に制限は施しておりません。
- 引数の数が4つに満たないとエラーとなります。

## Description
You can scraping the web-site(yamap) which is designed for hikers or climbers.

This scraping tool can quickly find a 'yamap-activity-diary' that contains specific words.

## How to Execute
`node yamap.js mountain-name keyword1 keyword2 ... .. .`

- you can search 'yamap-activity-diary' using any word not only mountain-name.
- you can set keyword as many as you want.
- if number of argument less than 3, error will occure.
