from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.dependencies import get_model_manager
from api.routers import experiments, health, models


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    # シャットダウン時にモデルをアンロード
    manager = get_model_manager()
    manager.unload()


app = FastAPI(
    title="llm-abyss API",
    description="ローカル LLM の Mechanistic Interpretability ツール",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(models.router, prefix="/api/models")
app.include_router(experiments.router, prefix="/api/experiments")
