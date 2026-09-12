# CUDA runtime + cuDNN, so torch can use the GPU. Run with `--gpus all`
# (or docker-compose's `gpus: all`) and the NVIDIA Container Toolkit
# installed on the host.
FROM nvidia/cuda:12.6.3-cudnn-runtime-ubuntu24.04

# Install the latest available Python 3 via the deadsnakes PPA.
RUN apt-get update && apt-get install -y --no-install-recommends \
        software-properties-common \
        curl \
        build-essential \
    && add-apt-repository -y ppa:deadsnakes/ppa \
    && apt-get update && apt-get install -y --no-install-recommends \
        python3.13 \
        python3.13-venv \
        python3.13-dev \
    && rm -rf /var/lib/apt/lists/* \
    && update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.13 1 \
    && curl -sS https://bootstrap.pypa.io/get-pip.py | python3.13

WORKDIR /app

# Base dependencies as explicitly requested: latest transformers/torch/accelerate.
RUN pip install --no-cache-dir -U pip \
    && pip install --no-cache-dir -U transformers torch accelerate

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/
# Frontend build output (run `npm run build` in frontend/ beforehand).
COPY www/ ./www/

ENV MODEL_PATH=/app/model \
    PYTHONUNBUFFERED=1

# The model is NOT copied into the image — it is mounted at runtime from
# backend/model/ (see docker-compose.yml and scripts/download_model.py).
VOLUME ["/app/model"]

EXPOSE 8000

CMD ["python3", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
