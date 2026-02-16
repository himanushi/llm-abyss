import torch


def get_device() -> str:
    """利用可能な最適デバイスを返す。MPS > CUDA > CPU の優先順。"""
    if torch.backends.mps.is_available():
        return "mps"
    if torch.cuda.is_available():
        return "cuda"
    return "cpu"


def get_device_info() -> dict:
    """デバイスの詳細情報を返す。"""
    device = get_device()
    info = {
        "device": device,
        "torch_version": torch.__version__,
        "mps_available": torch.backends.mps.is_available(),
        "cuda_available": torch.cuda.is_available(),
    }
    if device == "cuda":
        info["cuda_device_name"] = torch.cuda.get_device_name(0)
        info["cuda_memory_gb"] = round(torch.cuda.get_device_properties(0).total_mem / 1e9, 1)
    return info
