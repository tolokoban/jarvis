#!/usr/bin/env python3
"""Download Qwen/Qwen2.5-3B-Instruct into backend/model/<model-name>/.

Run this once on the HOST (not inside the container) before starting the
server, so that backend/model/<model-name>/ is populated. docker-compose
then mounts backend/model/ into the container at runtime, and MODEL_PATH
selects which subfolder to actually load (see src/model.py).

Each model gets its own subfolder (named after its Hugging Face repo) so
several models can be downloaded side by side.

    pip install -U huggingface_hub
    python scripts/download_model.py

If the model repo ever requires accepting a license on Hugging Face,
authenticate first (`huggingface-cli login`) or export HF_TOKEN.
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path

from huggingface_hub import snapshot_download

MODEL_ID = "Qwen/Qwen2.5-3B-Instruct"
MODEL_ROOT = Path(__file__).resolve().parent.parent / "model"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model-id", default=MODEL_ID, help="Hugging Face repo id")
    parser.add_argument(
        "--target",
        type=Path,
        default=None,
        help="Destination directory (default: backend/model/<repo-name>, derived from --model-id)",
    )
    args = parser.parse_args()
    if args.target is None:
        args.target = MODEL_ROOT / args.model_id.split("/")[-1]

    args.target.mkdir(parents=True, exist_ok=True)
    print(f"Downloading {args.model_id} into {args.target} ...")
    snapshot_download(
        repo_id=args.model_id,
        local_dir=str(args.target),
        token=os.environ.get("HF_TOKEN"),
    )
    print("Done.")


if __name__ == "__main__":
    main()
