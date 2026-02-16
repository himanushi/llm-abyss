from __future__ import annotations

from typing import Any

import torch


def tensor_to_list(t: torch.Tensor) -> list[Any]:
    """Tensor を JSON シリアライズ可能なネストリストに変換する。"""
    return t.detach().cpu().float().tolist()


def topk_tokens(
    logits: torch.Tensor,
    tokenizer,
    k: int = 10,
) -> list[dict]:
    """logits ベクトルから top-k トークンと確率を返す。"""
    probs = torch.softmax(logits.float(), dim=-1)
    top_probs, top_indices = torch.topk(probs, k)
    return [
        {
            "token_id": idx.item(),
            "token": tokenizer.decode([idx.item()]),
            "probability": prob.item(),
        }
        for prob, idx in zip(top_probs, top_indices)
    ]
