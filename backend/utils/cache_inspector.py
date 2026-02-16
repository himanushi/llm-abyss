"""HuggingFace キャッシュを検査してダウンロード済みモデルを検出する。"""

from __future__ import annotations

import logging

from huggingface_hub import scan_cache_dir

from utils.model_registry import MODELS, ModelInfo

logger = logging.getLogger(__name__)


def get_downloaded_models() -> list[dict]:
    """ダウンロード済みかつ厳選リストに含まれるモデルの情報を返す。"""
    try:
        cache_info = scan_cache_dir()
    except Exception:
        logger.warning("HuggingFace キャッシュの読み取りに失敗")
        return []

    # キャッシュ内のリポジトリ名を収集
    cached_repos: dict[str, float] = {}
    for repo in cache_info.repos:
        size_gb = round(repo.size_on_disk / (1024**3), 2)
        cached_repos[repo.repo_id] = size_gb

    results = []
    for model_info in MODELS.values():
        if model_info.hf_name in cached_repos:
            results.append({
                "id": model_info.id,
                "name": model_info.name,
                "size_gb": cached_repos[model_info.hf_name],
            })

    return results


def is_model_downloaded(model_info: ModelInfo) -> bool:
    """指定モデルがダウンロード済みかチェックする。"""
    try:
        cache_info = scan_cache_dir()
    except Exception:
        return False

    for repo in cache_info.repos:
        if repo.repo_id == model_info.hf_name:
            return True
    return False
