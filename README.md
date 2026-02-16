# llm-abyss

小型 LLM の内部挙動を観察・可視化・分析し、LLM が「何をしているのか」を理解することを目的としたプロジェクト。

## コンセプト

LLM をブラックボックスとして使うのではなく、その内部で何が起きているのかを自分の手で確かめる。

## 実験テーマ（予定）

- Attention Head の可視化と役割分析
- ニューロンの発火パターン観察
- Logit Lens によるレイヤーごとの予測変化の追跡
- 温度・top_p パラメータによる出力分布の変化
- 日本語 vs 英語での内部表現の違い
- モデルサイズ・量子化レベルによる振る舞いの差異
- LLM 同士の対話における創発的パターン

## 技術スタック

### Backend

- Python
- TransformerLens（モデル内部の解析）
- FastAPI（API サーバー）
- PyTorch

### Frontend

- TypeScript
- React
- shadcn/ui
- Tailwind CSS
- D3.js / Recharts（可視化）

## セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/himanushi/llm-abyss.git
cd llm-abyss

# Backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
npm run dev
```

## ディレクトリ構成

```
llm-abyss/
├── backend/          # Python API サーバー & 実験スクリプト
│   ├── experiments/  # 各実験のスクリプト
│   ├── api/          # FastAPI エンドポイント
│   └── utils/        # 共通ユーティリティ
├── frontend/         # React 可視化アプリ
│   └── src/
│       ├── components/
│       └── pages/
├── notebooks/        # Jupyter Notebook（探索的分析）
├── results/          # 実験結果の記録
├── docs/             # 実験ノート・知見まとめ
├── CLAUDE.md
└── README.md
```

## 実験ノート

実験の結果と考察は `docs/` 配下に記録していく。

