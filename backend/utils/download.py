"""SSE によるモデルダウンロード進捗ストリーミング。"""

from __future__ import annotations

import asyncio
import json
import logging
from collections.abc import AsyncGenerator
from concurrent.futures import ThreadPoolExecutor

from huggingface_hub import HfApi, hf_hub_download

from utils.model_registry import ModelInfo

logger = logging.getLogger(__name__)

_executor = ThreadPoolExecutor(max_workers=1)


def _get_repo_files(hf_name: str) -> list[dict]:
    """リポジトリ内のファイル一覧とサイズを取得する。"""
    api = HfApi()
    files = api.list_repo_files(hf_name)
    repo_info = api.repo_info(hf_name)
    siblings = {s.rfilename: s.size or 0 for s in repo_info.siblings}
    return [
        {"filename": f, "size": siblings.get(f, 0)}
        for f in files
    ]


def _download_file(hf_name: str, filename: str) -> str:
    """1ファイルをダウンロードし、ローカルパスを返す。"""
    return hf_hub_download(repo_id=hf_name, filename=filename)


async def download_model_stream(model_info: ModelInfo) -> AsyncGenerator[str, None]:
    """モデルをダウンロードしながら SSE イベントを生成する。"""
    loop = asyncio.get_event_loop()
    hf_name = model_info.hf_name

    yield _sse_event("start", {"model": model_info.id, "hf_name": hf_name})

    try:
        files = await loop.run_in_executor(_executor, _get_repo_files, hf_name)
        total_size = sum(f["size"] for f in files)
        downloaded_size = 0

        yield _sse_event("files", {
            "total_files": len(files),
            "total_size_mb": round(total_size / (1024**2), 1),
        })

        for i, file_info in enumerate(files):
            filename = file_info["filename"]
            file_size = file_info["size"]

            yield _sse_event("file_start", {
                "file": filename,
                "file_index": i,
                "file_size_mb": round(file_size / (1024**2), 2),
            })

            await loop.run_in_executor(_executor, _download_file, hf_name, filename)
            downloaded_size += file_size

            progress = (downloaded_size / total_size * 100) if total_size > 0 else 100
            yield _sse_event("file_done", {
                "file": filename,
                "file_index": i,
                "progress_percent": round(progress, 1),
                "downloaded_mb": round(downloaded_size / (1024**2), 1),
            })

        yield _sse_event("complete", {"model": model_info.id})

    except Exception as e:
        logger.exception(f"モデル {model_info.id} のダウンロード中にエラー")
        yield _sse_event("error", {"message": str(e)})


def _sse_event(event: str, data: dict) -> str:
    return json.dumps({"event": event, **data})
