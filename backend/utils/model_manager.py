"""モデルのロード・アンロードを管理する。メモリにロードできるモデルは1つだけ。"""

from __future__ import annotations

import gc
import logging
from typing import TYPE_CHECKING

import torch
from transformer_lens import HookedTransformer

from utils.device import get_device
from utils.model_registry import ModelInfo, get_model_info

if TYPE_CHECKING:
    pass

logger = logging.getLogger(__name__)


class ModelManager:
    def __init__(self):
        self._model: HookedTransformer | None = None
        self._model_name: str | None = None
        self._device: str | None = None

    @property
    def model(self) -> HookedTransformer | None:
        return self._model

    @property
    def model_name(self) -> str | None:
        return self._model_name

    @property
    def device(self) -> str | None:
        return self._device

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    def get_model_info(self) -> ModelInfo | None:
        if self._model_name is None:
            return None
        return get_model_info(self._model_name)

    def load(self, model_name: str) -> HookedTransformer:
        """モデルをロードする。既にロード済みの場合はアンロードしてからロードする。"""
        info = get_model_info(model_name)
        if info is None:
            raise ValueError(f"未知のモデル: {model_name}")

        # 同じモデルが既にロード済みならそのまま返す
        if self._model_name == model_name and self._model is not None:
            logger.info(f"モデル {model_name} は既にロード済み")
            return self._model

        # 別のモデルがロード済みならアンロード
        if self._model is not None:
            self.unload()

        device = get_device()
        logger.info(f"モデル {model_name} ({info.hf_name}) を {device} にロード中...")

        self._model = HookedTransformer.from_pretrained(
            info.hf_name,
            device=device,
            dtype=torch.float32,  # MPS では fp16 が不安定
        )
        self._model_name = model_name
        self._device = device

        logger.info(f"モデル {model_name} のロード完了")
        return self._model

    def unload(self):
        """現在ロード中のモデルをアンロードしてメモリを解放する。"""
        if self._model is None:
            return

        model_name = self._model_name
        logger.info(f"モデル {model_name} をアンロード中...")

        del self._model
        self._model = None
        self._model_name = None
        self._device = None

        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        logger.info(f"モデル {model_name} のアンロード完了")

    def require_model(self) -> HookedTransformer:
        """ロード済みモデルを返す。未ロードなら例外。"""
        if self._model is None:
            raise RuntimeError(
            "モデル未ロード。先に /api/models/load でロードしてください。"
        )
        return self._model
