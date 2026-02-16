"""トークナイズ分析。テキストをトークンに分解し、各トークンの情報を返す。"""

from __future__ import annotations

from transformer_lens import HookedTransformer

from schemas.experiments import TokenInfo, TokenizationResponse


def run_tokenization(
    model: HookedTransformer,
    text: str,
) -> TokenizationResponse:
    """テキストをトークナイズし、各トークンの詳細情報を返す。"""
    token_ids = model.tokenizer.encode(text)
    str_tokens = model.to_str_tokens(text)

    tokens: list[TokenInfo] = []
    for i, (tid, tstr) in enumerate(zip(token_ids, str_tokens)):
        token_bytes = repr(tstr)
        tokens.append(TokenInfo(
            token_id=tid,
            token_str=tstr,
            token_bytes=token_bytes,
            position=i,
        ))

    return TokenizationResponse(
        text=text,
        token_count=len(tokens),
        tokens=tokens,
        vocab_size=model.tokenizer.vocab_size,
    )
