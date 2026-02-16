from __future__ import annotations

from pydantic import BaseModel, Field


class TextInput(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)


class AttentionRequest(TextInput):
    layer: int | None = None  # None なら全レイヤー
    head: int | None = None


class AttentionHeadResult(BaseModel):
    layer: int
    head: int
    pattern: list[list[float]]  # [dest_token, src_token]


class AttentionResponse(BaseModel):
    tokens: list[str]
    heads: list[AttentionHeadResult]


class LogitLensRequest(TextInput):
    top_k: int = Field(default=10, ge=1, le=50)


class LogitLensLayerResult(BaseModel):
    layer: int
    top_tokens: list[dict]  # [{token, token_id, probability}, ...]


class LogitLensResponse(BaseModel):
    tokens: list[str]
    layers: list[LogitLensLayerResult]


class NeuronsRequest(TextInput):
    layer: int
    top_k: int = Field(default=20, ge=1, le=100)


class NeuronActivation(BaseModel):
    neuron_index: int
    activation: float
    token: str
    token_position: int


class NeuronsResponse(BaseModel):
    tokens: list[str]
    layer: int
    top_neurons: list[NeuronActivation]
    activation_map: list[list[float]]  # [position, neuron] (top_k のみ)


class GenerationRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    max_new_tokens: int = Field(default=50, ge=1, le=200)
    temperature: float = Field(default=1.0, ge=0.01, le=5.0)
    top_k_tokens: int = Field(default=10, ge=1, le=50)


class GenerationTokenResult(BaseModel):
    token: str
    token_id: int
    probability: float
    top_alternatives: list[dict]  # [{token, token_id, probability}, ...]


class GenerationResponse(BaseModel):
    input_text: str
    generated_text: str
    tokens: list[GenerationTokenResult]


class TokenizationRequest(TextInput):
    pass


class TokenInfo(BaseModel):
    token_id: int
    token_str: str
    token_bytes: str  # repr 表示
    position: int


class TokenizationResponse(BaseModel):
    text: str
    token_count: int
    tokens: list[TokenInfo]
    vocab_size: int
