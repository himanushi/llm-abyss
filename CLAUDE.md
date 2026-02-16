# CLAUDE.md

## プロジェクト概要

llm-abyss は、ローカル LLM の内部挙動を観察・可視化・分析するための実験プロジェクト。
Mechanistic Interpretability（機械的解釈可能性）の手法を用いて、LLM の「深淵」を覗く。

## 技術スタック

- Backend: Python, FastAPI, TransformerLens, PyTorch
- Frontend: TypeScript, React, shadcn/ui, Tailwind CSS
- 可視化: D3.js, Recharts
- 対象モデル: GPT-2 small 等の小型ローカル LLM

## ディレクトリ構成

- `backend/` - Python API サーバー & 実験スクリプト
- `backend/experiments/` - 各実験のスクリプト
- `backend/api/` - FastAPI エンドポイント
- `backend/utils/` - 共通ユーティリティ
- `frontend/` - React 可視化アプリ
- `notebooks/` - 探索的分析用 Jupyter Notebook
- `results/` - 実験結果データ（JSON 等）
- `docs/` - 実験ノート・知見まとめ

## コーディング規約

- Python: ruff でフォーマット・リント
- TypeScript: ESLint + Prettier
- コミットメッセージ: 日本語 OK、実験内容がわかるように書く
  - 例: `experiment: Attention Head の可視化を追加`
  - 例: `fix: トークナイザのエンコーディング修正`
  - 例: `docs: temperature 実験の考察を記録`

## コマンド

```bash
# Backend 起動
cd backend && uvicorn api.main:app --reload

# Frontend 起動
cd frontend && npm run dev

# リント
cd backend && ruff check .
cd frontend && npm run lint

# 実験スクリプト実行
cd backend && python -m experiments.<experiment_name>
```

## 重要な注意事項

- このプロジェクトはローカル環境で完結する。外部 API やクラウドサービスは使わない
- 実験結果は `results/` に JSON で保存し、フロントエンドで可視化する
- 新しい実験を追加する際は `backend/experiments/` にスクリプトを作成し、対応する API エンドポイントを `backend/api/` に追加する
- 実験の知見・考察は `docs/` に Markdown で記録する
- 対象モデルは M1 Mac で動作する小型モデルを前提とする
