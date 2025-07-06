# TOFUラボ週刊情報誌アプリ

[![npm version](https://img.shields.io/npm/v/npm.svg?logo=npm)](https://www.npmjs.com/)
[![Node.js Version](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen?logo=node.js)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 概要

TOFUラボ週刊情報誌アプリは、Discord・Webサイト・YouTube等から情報を自動収集し、AIで整理・編集してWordPressに投稿できる次世代の情報誌自動化システムです。Next.js（React）+ Supabase + shadcn/ui を採用し、モダンなUI/UXと自動化を両立しています。

---

## 開発・編集方法

### 1. ローカルでの開発

1. このリポジトリをクローン
    ```sh
    git clone <YOUR_GIT_URL>
    cd <YOUR_PROJECT_NAME>
    ```
2. Node.js（v18以上）とnpmをインストール（[nvm推奨](https://github.com/nvm-sh/nvm#installing-and-updating)）
3. 依存パッケージをインストール
    ```sh
    npm install
    ```
4. 開発サーバ起動
    ```sh
    npm run dev
    ```

### 2. GitHub上での編集
- GitHubのファイル画面で鉛筆アイコンから直接編集・コミット可能

### 3. Codespacesの利用
- GitHub CodespacesでクラウドIDE開発も対応

---

## 主な技術スタック

- Next.js（React）
- TypeScript
- Supabase（DB・認証・API）
- shadcn/ui（UIコンポーネント）
- Node.js（v18以上）

---
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7ca7e201-0458-452f-bc43-813022d983ae) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
