from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class ModelInfoResponse(BaseModel):
    id: str
    name: str
    params: str
    n_layers: int
    description: str
    downloaded: bool = False


class ModelLoadRequest(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    model_name: str


class ModelStatusResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    loaded: bool
    model_name: str | None = None
    model_info: ModelInfoResponse | None = None
    device: str | None = None


class DownloadedModelResponse(BaseModel):
    id: str
    name: str
    size_gb: float | None = None
