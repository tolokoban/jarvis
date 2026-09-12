"""Loading and running Qwen/Qwen2.5-3B-Instruct.

The model is expected to already be downloaded on disk (see
scripts/download_model.py, which puts it in its own subfolder under
backend/model/) and made available inside the container at MODEL_PATH
(backend/model/ as a whole is mounted as a volume by docker-compose;
MODEL_PATH then points at the specific model's subfolder within it, so
several downloaded models can live side by side).
"""

from __future__ import annotations

import logging
import os
from pathlib import Path

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

logger = logging.getLogger(__name__)

MODEL_PATH = Path(os.environ.get("MODEL_PATH", "/app/model/Qwen2.5-3B-Instruct"))
MAX_NEW_TOKENS = int(os.environ.get("MAX_NEW_TOKENS", "1024"))
SYSTEM_PROMPT = os.environ.get("SYSTEM_PROMPT", "You are a helpful assistant.")

_tokenizer: AutoTokenizer | None = None
_model: AutoModelForCausalLM | None = None


def load_model() -> None:
    """Load the model and tokenizer into memory. Called once at startup."""
    global _tokenizer, _model

    if not MODEL_PATH.exists() or not any(MODEL_PATH.iterdir()):
        raise RuntimeError(
            f"Model directory '{MODEL_PATH}' is missing or empty. Run "
            "scripts/download_model.py (on the host) before starting the "
            "container, and make sure backend/model/ is mounted into it."
        )

    logger.info("Loading model from %s ...", MODEL_PATH)
    _tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    _model = AutoModelForCausalLM.from_pretrained(
        MODEL_PATH,
        dtype="auto",
        device_map="auto",
    )
    logger.info("Model loaded on device(s): %s", _model.device)


def generate(content: str) -> str:
    """Run one chat turn through the model and return the assistant's reply."""
    if _model is None or _tokenizer is None:
        raise RuntimeError("Model is not loaded yet.")

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": content},
    ]

    inputs = _tokenizer.apply_chat_template(
        messages,
        tokenize=True,
        return_dict=True,
        return_tensors="pt",
        add_generation_prompt=True,
    ).to(_model.device)
    input_len = inputs["input_ids"].shape[-1]

    with torch.inference_mode():
        outputs = _model.generate(**inputs, max_new_tokens=MAX_NEW_TOKENS)

    response = _tokenizer.decode(outputs[0][input_len:], skip_special_tokens=True)
    return response.strip()
