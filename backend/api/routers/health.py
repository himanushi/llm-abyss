from fastapi import APIRouter

from utils.device import get_device_info

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        **get_device_info(),
    }
