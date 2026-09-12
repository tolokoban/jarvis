"""FastAPI server exposing POST /api/chat backed by Qwen/Qwen2.5-3B-Instruct.

All REST endpoints live under /api/. Any other path is served from the
static frontend build in backend/www/ (produced by `npm run build` in
frontend/), so the SPA and its assets are served straight from this app.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles

from .model import generate, load_model
from .schemas import ChatRequest, ChatResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

WWW_DIR = Path(__file__).resolve().parent.parent / "www"


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield


app = FastAPI(
    title="Qwen Chat API",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

api = APIRouter(prefix="/api")


@api.get("/health")
def health() -> dict:
    return {"status": "ok"}


@api.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    try:
        reply = generate(request.content)
    except Exception:
        logger.exception("Generation failed")
        raise HTTPException(status_code=500, detail="Model generation failed")
    return ChatResponse(response=reply)


app.include_router(api)

# Anything that doesn't start with /api/ is served as a static file from
# backend/www/ (the frontend build output), falling back to index.html so
# client-side routing works. Mounted last so it doesn't shadow /api/*.
if WWW_DIR.is_dir():
    app.mount("/", StaticFiles(directory=WWW_DIR, html=True), name="www")
else:
    logger.warning(
        "Static frontend directory %s not found; only /api/* routes are available. "
        "Run `npm run build` in frontend/ to generate it.",
        WWW_DIR,
    )
