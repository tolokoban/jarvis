# Backend

A REST API serving [Qwen/Qwen2.5-3B-Instruct](https://huggingface.co/Qwen/Qwen2.5-3B-Instruct) via a
FastAPI server, running in a CUDA-enabled Docker container.

## Layout

```
backend/
├── Dockerfile            # CUDA + latest Python, transformers/torch/accelerate
├── docker-compose.yml     # builds the image, mounts model/, passes through the GPU
├── requirements.txt        # web server deps (fastapi, uvicorn, pydantic)
├── model/                  # downloaded models, one subfolder per model (git-ignored, mounted into the container)
│   └── Qwen2.5-3B-Instruct/  # weights for the currently active model
├── www/                    # frontend build output (git-ignored, produced by `npm run build` in frontend/)
├── scripts/
│   └── download_model.py   # run on the HOST to populate model/<model-name>/
└── src/
    ├── main.py             # FastAPI app: POST /api/chat, static files from www/ otherwise
    ├── model.py             # model loading + generation
    └── schemas.py            # request/response schemas
```

## 1. Download the model (host machine, once)

```bash
cd backend
pip install -U huggingface_hub
python scripts/download_model.py
```

This downloads the full model into its own subfolder, e.g.
`backend/model/Qwen2.5-3B-Instruct/`, named after its Hugging Face repo —
so several models can be downloaded side by side. If the repo ever
requires accepting a license on Hugging Face, log in first
(`huggingface-cli login`) or set `HF_TOKEN`.

To download a different model, pass `--model-id` and `--target`, e.g.:

```bash
python scripts/download_model.py --model-id Qwen/Qwen2.5-7B-Instruct
```

Then point `MODEL_NAME` (used by `jarvis/jarvis.sh`) or `MODEL_PATH` (used
directly by docker-compose) at that subfolder to actually load it — see
Configuration below.

## 2. Build and run the container

Requires the [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)
installed on the host so Docker can see the GPU.

```bash
docker compose up --build
```

The model directory is mounted read-only at `/app/model` inside the
container rather than baked into the image, so rebuilds stay fast and the
image stays small.

## 3. Call the API

All REST endpoints live under `/api/`; every other path is served as a
static file from `backend/www/` (build the frontend first with
`npm run build` in `frontend/`, or `www/` will be empty).

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"content": "Write a short joke about saving RAM."}'
```

```json
{ "response": "Here is a joke..." }
```

`GET /api/health` returns `{"status": "ok"}` once the server is up (the
model itself may still be loading — check container logs).

## Configuration

Environment variables (set in `docker-compose.yml`, or exported on the host
before `docker compose up` — `jarvis/jarvis.sh` does this for `MODEL_NAME`):

| Variable         | Default                          | Description                                                 |
|------------------|----------------------------------|-------------------------------------------------------------|
| `MODEL_NAME`     | `Qwen2.5-3B-Instruct`            | Subfolder of `model/` to load; used to build `MODEL_PATH`   |
| `MODEL_PATH`     | `/app/model/Qwen2.5-3B-Instruct` | Where the server looks for the model (inside the container) |
| `MAX_NEW_TOKENS` | `1024`                           | Max tokens generated per reply                              |
| `SYSTEM_PROMPT`  | `You are a helpful assistant.`   | System prompt prepended to each chat                        |
