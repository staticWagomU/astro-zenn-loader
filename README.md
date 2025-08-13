# astro-zenn-loader

Astro Content Collections用のZenn RSSローダーです。Zennの記事をAstroのコンテンツコレクションとして簡単に取得・管理できます。

## 特徴

- 🚀 **簡単な設定** - わずか数行のコードでZennの記事を取得
- 📝 **型安全** - Zodスキーマによる完全な型サポート
- 🔄 **自動同期** - RSSフィードから最新の記事を自動取得
- ⚡ **高速** - Astro Content Layer APIを活用した効率的なデータ取得
- 🛠️ **エラーハンドリング** - 堅牢なエラー処理とログ出力

## インストール

```bash
npm install astro-zenn-loader
```

または

```bash
yarn add astro-zenn-loader
```

または

```bash
pnpm add astro-zenn-loader
```

## 基本的な使い方

### 1. コンテンツコレクションの設定

`src/content.config.ts`ファイルを作成し、Zennローダーを設定します：

```typescript
import { defineCollection } from 'astro:content';
import { zennLoader } from 'astro-zenn-loader';

const zennArticles = defineCollection({
  loader: zennLoader({
    name: 'your-zenn-username', // あなたのZennユーザー名
  }),
});

export const collections = {
  zennArticles,
};
```

### 2. Astroページでの使用

```astro
---
// src/pages/articles.astro
import { getCollection } from 'astro:content';

const articles = await getCollection('zennArticles');
---

<html>
  <head>
    <title>Zenn Articles</title>
  </head>
  <body>
    <h1>My Zenn Articles</h1>
    <ul>
      {articles.map((article) => (
        <li>
          <a href={article.data.link}>
            <h2>{article.data.title}</h2>
            <p>{article.data.contentSnippet}</p>
            <time>{new Date(article.data.pubDate).toLocaleDateString()}</time>
          </a>
        </li>
      ))}
    </ul>
  </body>
</html>
```

## 詳細な使用例

### 記事の詳細ページ

個別の記事詳細を表示する場合：

```astro
---
// src/pages/article/[id].astro
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const articles = await getCollection('zennArticles');
  return articles.map((article) => ({
    params: { id: article.id },
  }));
}

const { id } = Astro.params;
const article = await getEntry('zennArticles', id);
---

<html>
  <head>
    <title>{article.data.title}</title>
  </head>
  <body>
    <article>
      <h1>{article.data.title}</h1>
      <p>著者: {article.data.creator}</p>
      <time>公開日: {new Date(article.data.pubDate).toLocaleDateString()}</time>

      <div set:html={article.data.content} />

      <a href={article.data.link}>Zennで読む →</a>
    </article>
  </body>
</html>
```

## APIリファレンス

### `zennLoader(options)`

Zenn RSSローダーを作成します。

#### パラメータ

- `options.name` (string, required): ZennのユーザーID

#### 返り値

Astro Content Collections用のローダーオブジェクト

### データスキーマ

各記事エントリーは以下の型を持ちます：

```typescript
interface ZennItem {
  creator: string;          // 著者名
  title: string;            // 記事タイトル
  link: string;             // 記事URL
  pubDate: string;          // 公開日
  enclosure: {              // OGP画像情報
    url: string;
    length: string | number;
    type: string;
  };
  "dc:creator": string;     // 著者名
  content: string;          // 記事本文（HTML）
  contentSnippet: string;   // 記事の要約
  guid: string;             // 一意のID
  isoDate: string;          // ISO 8601形式の日付
}
```

## ライセンス

MIT

## コントリビューション

プルリクエストを歓迎します！バグ報告や機能リクエストは[Issues](https://github.com/staticWagomU/astro-zenn-loader/issues)でお知らせください。

## 作者

[@staticWagomU](https://github.com/staticWagomU)

## 関連リンク

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Zenn](https://zenn.dev/)
- [RSS Parser](https://www.npmjs.com/package/rss-parser)
