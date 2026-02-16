from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from api.dependencies import get_model_manager
from experiments.attention import run_attention_analysis
from experiments.generation import run_generation
from experiments.logit_lens import run_logit_lens
from experiments.neurons import run_neuron_analysis
from experiments.tokenization import run_tokenization
from schemas.experiments import (
    AttentionRequest,
    AttentionResponse,
    GenerationRequest,
    GenerationResponse,
    LogitLensRequest,
    LogitLensResponse,
    NeuronsRequest,
    NeuronsResponse,
    TokenizationRequest,
    TokenizationResponse,
)
from utils.model_manager import ModelManager

router = APIRouter(tags=["experiments"])


def _require_model(manager: ModelManager = Depends(get_model_manager)):
    """モデルがロード済みであることを保証する依存関数。"""
    try:
        return manager.require_model()
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/attention", response_model=AttentionResponse)
async def attention_experiment(
    request: AttentionRequest,
    manager: ModelManager = Depends(get_model_manager),
):
    model = _require_model(manager)
    try:
        return run_attention_analysis(
            model=model,
            text=request.text,
            layer=request.layer,
            head=request.head,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Attention 分析エラー: {e}")


@router.post("/logit-lens", response_model=LogitLensResponse)
async def logit_lens_experiment(
    request: LogitLensRequest,
    manager: ModelManager = Depends(get_model_manager),
):
    model = _require_model(manager)
    try:
        return run_logit_lens(
            model=model,
            text=request.text,
            top_k=request.top_k,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Logit Lens 分析エラー: {e}")


@router.post("/neurons", response_model=NeuronsResponse)
async def neurons_experiment(
    request: NeuronsRequest,
    manager: ModelManager = Depends(get_model_manager),
):
    model = _require_model(manager)
    if request.layer < 0 or request.layer >= model.cfg.n_layers:
        raise HTTPException(
            status_code=400,
            detail=f"レイヤーは 0〜{model.cfg.n_layers - 1} の範囲で指定してください。",
        )
    try:
        return run_neuron_analysis(
            model=model,
            text=request.text,
            layer=request.layer,
            top_k=request.top_k,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ニューロン分析エラー: {e}")


@router.post("/generation", response_model=GenerationResponse)
async def generation_experiment(
    request: GenerationRequest,
    manager: ModelManager = Depends(get_model_manager),
):
    model = _require_model(manager)
    try:
        return run_generation(
            model=model,
            text=request.text,
            max_new_tokens=request.max_new_tokens,
            temperature=request.temperature,
            top_k_tokens=request.top_k_tokens,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"生成エラー: {e}")


@router.post("/tokenization", response_model=TokenizationResponse)
async def tokenization_experiment(
    request: TokenizationRequest,
    manager: ModelManager = Depends(get_model_manager),
):
    model = _require_model(manager)
    try:
        return run_tokenization(
            model=model,
            text=request.text,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"トークナイズエラー: {e}")
