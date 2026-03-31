# Claude Code リモート接続セットアップ（Mac）

## 問題

`claude remote-control` を実行すると以下のエラーが出る：

```
Error: Workspace not trusted. Please run `claude` in /Users/jin first to review and accept the workspace trust dialog.
```

## 原因

`~/.claude.json` の `/Users/jin` プロジェクト設定で信頼フラグが `false` のまま：

```json
"/Users/jin": {
  "hasTrustDialogAccepted": false
}
```

## 解決方法

### 方法1：テキストエディタで修正（簡単）

```bash
open ~/.claude.json
```

`/Users/jin` のセクションを探して変更：

```json
"hasTrustDialogAccepted": false,
```
↓
```json
"hasTrustDialogAccepted": true,
```

保存して閉じる。

---

### 方法2：コマンドで修正

```bash
# バックアップを取る
cp ~/.claude.json ~/.claude.json.bak

# 修正（Python使用）
python3 -c "
import json
with open('/Users/jin/.claude.json', 'r') as f:
    data = json.load(f)
data['projects']['/Users/jin']['hasTrustDialogAccepted'] = True
with open('/Users/jin/.claude.json', 'w') as f:
    json.dump(data, f, indent=2)
print('完了')
"
```

---

## 接続手順

修正後、以下を実行：

```bash
cd /Users/jin && claude remote-control
```

ブラウザで以下を開く：

```
https://claude.ai/code
```

Macのローカルセッションが表示されたら接続完了！

---

## 接続後にできること

| 機能 | 説明 |
|------|------|
| ローカルファイル操作 | MacのどのフォルダでもClaude経由で編集できる |
| デスクトップ整理 | 携帯からMacのデスクトップを整理できる |
| GitHubと連携 | ローカル変更をそのままGitHubにプッシュ |

---

*作成：FLATUP GYM × Claude Code*
