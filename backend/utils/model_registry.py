"""厳選モデルリスト定義。M1 Mac で動作可能な小型モデルのみ。"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ModelInfo:
    id: str
    name: str
    hf_name: str  # TransformerLens が受け付ける名前
    params: str
    n_layers: int
    description: str


MODELS: dict[str, ModelInfo] = {
    m.id: m
    for m in [
        ModelInfo(
            id="gpt2",
            name="GPT-2 Small",
            hf_name="gpt2",
            params="124M",
            n_layers=12,
            description="OpenAI GPT-2 の基本モデル。Mechanistic Interpretability 研究の標準。",
        ),
        ModelInfo(
            id="gpt2-medium",
            name="GPT-2 Medium",
            hf_name="gpt2-medium",
            params="355M",
            n_layers=24,
            description="GPT-2 の中型モデル。より複雑なパターンの観察に。",
        ),
        ModelInfo(
            id="gpt2-large",
            name="GPT-2 Large",
            hf_name="gpt2-large",
            params="774M",
            n_layers=36,
            description="GPT-2 の大型モデル。メモリ8GB以上推奨。",
        ),
        ModelInfo(
            id="distilgpt2",
            name="DistilGPT-2",
            hf_name="distilgpt2",
            params="82M",
            n_layers=6,
            description="GPT-2 の蒸留モデル。軽量で高速。",
        ),
        ModelInfo(
            id="pythia-14m",
            name="Pythia 14M",
            hf_name="EleutherAI/pythia-14m",
            params="14M",
            n_layers=6,
            description="最小の Pythia モデル。実験の素早いプロトタイピングに最適。",
        ),
        ModelInfo(
            id="pythia-70m",
            name="Pythia 70M",
            hf_name="EleutherAI/pythia-70m",
            params="70M",
            n_layers=6,
            description="小型 Pythia モデル。軽量ながら意味のある分析が可能。",
        ),
        ModelInfo(
            id="pythia-160m",
            name="Pythia 160M",
            hf_name="EleutherAI/pythia-160m",
            params="160M",
            n_layers=12,
            description="中小型 Pythia モデル。GPT-2 Small と同等のレイヤー数。",
        ),
        ModelInfo(
            id="pythia-410m",
            name="Pythia 410M",
            hf_name="EleutherAI/pythia-410m",
            params="410M",
            n_layers=24,
            description="中型 Pythia モデル。メモリに余裕がある場合に。",
        ),
        ModelInfo(
            id="gpt-neo-125m",
            name="GPT-Neo 125M",
            hf_name="EleutherAI/gpt-neo-125M",
            params="125M",
            n_layers=12,
            description="EleutherAI の GPT-Neo 125M。GPT-2 Small の代替として。",
        ),
        ModelInfo(
            id="qwen2.5-0.5b",
            name="Qwen2.5 0.5B",
            hf_name="Qwen/Qwen2.5-0.5B",
            params="494M",
            n_layers=24,
            description="Qwen2.5 の最小モデル。日本語トークナイザ対応で日本語分析に最適。",
        ),
        ModelInfo(
            id="qwen2.5-1.5b",
            name="Qwen2.5 1.5B",
            hf_name="Qwen/Qwen2.5-1.5B",
            params="1.5B",
            n_layers=28,
            description="Qwen2.5 の小型モデル。日本語対応。メモリ8GB以上推奨。",
        ),
    ]
}


def get_model_info(model_name: str) -> ModelInfo | None:
    return MODELS.get(model_name)


def list_models() -> list[ModelInfo]:
    return list(MODELS.values())
