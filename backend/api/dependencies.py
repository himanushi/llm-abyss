from __future__ import annotations

from typing import TYPE_CHECKING

from utils.model_manager import ModelManager

if TYPE_CHECKING:
    pass

_manager: ModelManager | None = None


def get_model_manager() -> ModelManager:
    global _manager
    if _manager is None:
        _manager = ModelManager()
    return _manager
