"""Attention パターン分析。各ヘッドの Attention 重みを抽出する。"""

from __future__ import annotations

from transformer_lens import HookedTransformer

from schemas.experiments import AttentionHeadResult, AttentionResponse
from utils.serialization import tensor_to_list


def run_attention_analysis(
    model: HookedTransformer,
    text: str,
    layer: int | None = None,
    head: int | None = None,
) -> AttentionResponse:
    """Attention パターンを分析する。

    Args:
        model: ロード済みモデル
        text: 入力テキスト
        layer: 指定レイヤーのみ分析（None なら全レイヤー）
        head: 指定ヘッドのみ分析（None なら全ヘッド）
    """
    tokens = model.to_tokens(text)
    str_tokens = model.to_str_tokens(text)

    # Attention パターンのみキャッシュ
    def _attn_filter(name: str) -> bool:
        return name.endswith("hook_pattern")

    if layer is not None:
        names_filter = f"blocks.{layer}.attn.hook_pattern"
    else:
        names_filter = _attn_filter

    _, cache = model.run_with_cache(tokens, names_filter=names_filter)

    heads: list[AttentionHeadResult] = []
    n_layers = model.cfg.n_layers

    layer_range = [layer] if layer is not None else range(n_layers)
    for l_idx in layer_range:
        key = f"blocks.{l_idx}.attn.hook_pattern"
        if key not in cache:
            continue

        pattern = cache[key][0]  # batch=0: [n_heads, dest, src]
        n_heads = pattern.shape[0]
        head_range = [head] if head is not None else range(n_heads)

        for h_idx in head_range:
            if h_idx >= n_heads:
                continue
            heads.append(AttentionHeadResult(
                layer=l_idx,
                head=h_idx,
                pattern=tensor_to_list(pattern[h_idx]),
            ))

    return AttentionResponse(
        tokens=list(str_tokens),
        heads=heads,
    )
