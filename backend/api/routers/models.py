from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sse_starlette.sse import EventSourceResponse

from api.dependencies import get_model_manager
from schemas.models import (
    DownloadedModelResponse,
    ModelInfoResponse,
    ModelLoadRequest,
    ModelStatusResponse,
)
from utils.cache_inspector import get_downloaded_models, is_model_downloaded
from utils.download import download_model_stream
from utils.model_manager import ModelManager
from utils.model_registry import get_model_info, list_models

router = APIRouter(tags=["models"])


@router.get("/available", response_model=list[ModelInfoResponse])
async def get_available_models():
    """厳選モデルリストを返す。ダウンロード済みかどうかも付与。"""
    downloaded = {m["id"] for m in get_downloaded_models()}
    return [
        ModelInfoResponse(
            id=m.id,
            name=m.name,
            params=m.params,
            n_layers=m.n_layers,
            description=m.description,
            downloaded=m.id in downloaded,
        )
        for m in list_models()
    ]


@router.get("/downloaded", response_model=list[DownloadedModelResponse])
async def get_downloaded():
    """ダウンロード済みモデル一覧。"""
    return [DownloadedModelResponse(**m) for m in get_downloaded_models()]


@router.get("/status", response_model=ModelStatusResponse)
async def get_model_status(manager: ModelManager = Depends(get_model_manager)):
    """現在ロード中のモデル状態。"""
    if not manager.is_loaded:
        return ModelStatusResponse(loaded=False)

    info = manager.get_model_info()
    return ModelStatusResponse(
        loaded=True,
        model_name=manager.model_name,
        model_info=ModelInfoResponse(
            id=info.id,
            name=info.name,
            params=info.params,
            n_layers=info.n_layers,
            description=info.description,
            downloaded=True,
        ) if info else None,
        device=manager.device,
    )


@router.post("/load", response_model=ModelStatusResponse)
async def load_model(
    request: ModelLoadRequest,
    manager: ModelManager = Depends(get_model_manager),
):
    """モデルをメモリにロードする。"""
    info = get_model_info(request.model_name)
    if info is None:
        raise HTTPException(status_code=404, detail=f"未知のモデル: {request.model_name}")

    if not is_model_downloaded(info):
        raise HTTPException(
            status_code=400,
            detail=f"モデル {request.model_name} は未ダウンロードです。",
        )

    try:
        manager.load(request.model_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"モデルのロードに失敗: {e}")

    model_info = manager.get_model_info()
    return ModelStatusResponse(
        loaded=True,
        model_name=manager.model_name,
        model_info=ModelInfoResponse(
            id=model_info.id,
            name=model_info.name,
            params=model_info.params,
            n_layers=model_info.n_layers,
            description=model_info.description,
            downloaded=True,
        ) if model_info else None,
        device=manager.device,
    )


@router.post("/unload")
async def unload_model(manager: ModelManager = Depends(get_model_manager)):
    """現在のモデルをアンロードする。"""
    if not manager.is_loaded:
        raise HTTPException(status_code=400, detail="ロード中のモデルがありません。")
    manager.unload()
    return {"status": "unloaded"}


@router.get("/download/{model_name}")
async def download_model(model_name: str):
    """モデルをダウンロードする。SSE で進捗をストリーミング。"""
    info = get_model_info(model_name)
    if info is None:
        raise HTTPException(status_code=404, detail=f"未知のモデル: {model_name}")

    return EventSourceResponse(download_model_stream(info))
