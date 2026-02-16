"""テキスト生成 + トークンごとの確率分布。"""

from __future__ import annotations

import torch
from transformer_lens import HookedTransformer

from schemas.experiments import GenerationResponse, GenerationTokenResult
from utils.serialization import topk_tokens


def run_generation(
    model: HookedTransformer,
    text: str,
    max_new_tokens: int = 50,
    temperature: float = 1.0,
    top_k_tokens: int = 10,
) -> GenerationResponse:
    """テキストを生成し、各トークンの確率分布を返す。"""
    tokens = model.to_tokens(text)
    generated_tokens: list[GenerationTokenResult] = []
    all_tokens = tokens.clone()

    for _ in range(max_new_tokens):
        logits = model(all_tokens)  # [batch, seq, vocab]
        next_logits = logits[0, -1, :]  # [vocab]

        # Temperature 適用
        scaled_logits = next_logits / temperature

        # 確率分布
        probs = torch.softmax(scaled_logits.float(), dim=-1)

        # サンプリング
        next_token = torch.multinomial(probs, 1)
        next_token_id = next_token.item()
        next_token_str = model.tokenizer.decode([next_token_id])
        next_token_prob = probs[next_token_id].item()

        # Top-k 代替候補
        alternatives = topk_tokens(next_logits, model.tokenizer, k=top_k_tokens)

        generated_tokens.append(GenerationTokenResult(
            token=next_token_str,
            token_id=next_token_id,
            probability=next_token_prob,
            top_alternatives=alternatives,
        ))

        # EOS チェック
        eos_id = model.tokenizer.eos_token_id
        if eos_id is not None and next_token_id == eos_id:
            break

        all_tokens = torch.cat([all_tokens, next_token.unsqueeze(0)], dim=1)

    generated_text = model.tokenizer.decode(all_tokens[0].tolist())

    return GenerationResponse(
        input_text=text,
        generated_text=generated_text,
        tokens=generated_tokens,
    )
