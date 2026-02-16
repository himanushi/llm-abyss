"""Logit Lens 分析。各レイヤーの残差ストリームをデコードして予測を可視化する。"""

from __future__ import annotations

from transformer_lens import HookedTransformer

from schemas.experiments import LogitLensLayerResult, LogitLensResponse
from utils.serialization import topk_tokens


def run_logit_lens(
    model: HookedTransformer,
    text: str,
    top_k: int = 10,
) -> LogitLensResponse:
    """各レイヤーの残差ストリームを語彙空間に射影し、top-k 予測を返す。"""
    tokens = model.to_tokens(text)
    str_tokens = model.to_str_tokens(text)

    def _resid_filter(name: str) -> bool:
        return name.endswith("hook_resid_post")

    # 各レイヤーの残差ストリーム出力をキャッシュ
    names_filter = _resid_filter
    _, cache = model.run_with_cache(tokens, names_filter=names_filter)

    layers: list[LogitLensLayerResult] = []

    for l_idx in range(model.cfg.n_layers):
        key = f"blocks.{l_idx}.hook_resid_post"
        if key not in cache:
            continue

        resid = cache[key][0]  # [seq_len, d_model]

        # 最後のトークン位置の残差を Unembed で射影
        last_resid = resid[-1]  # [d_model]

        # LayerNorm + Unembed
        scaled = model.ln_final(last_resid.unsqueeze(0))
        logits = model.unembed(scaled)[0]  # [vocab_size]

        top = topk_tokens(logits, model.tokenizer, k=top_k)
        layers.append(LogitLensLayerResult(layer=l_idx, top_tokens=top))

    return LogitLensResponse(
        tokens=list(str_tokens),
        layers=layers,
    )
