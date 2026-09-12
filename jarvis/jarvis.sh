#!/usr/bin/env bash
# Start the backend (Docker), mapping its webserver to a random free port
# on the host, then open a browser on that same port. Ctrl-C stops and
# tears the container down.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$REPO_ROOT/backend"
# Currently active model. Each model lives in its own subfolder under
# backend/model/ (named after its Hugging Face repo), so several models can
# be downloaded side by side; this is the one docker-compose.yml loads.
# Keep this in sync with MODEL_ID in backend/scripts/download_model.py.
MODEL_NAME="Qwen2.5-3B-Instruct"
export MODEL_NAME
MODEL_DIR="$BACKEND_DIR/model/$MODEL_NAME"
# Dedicated virtualenv for host-side tooling (currently: downloading the
# model). Debian/Ubuntu/Mint block `pip install` into the system Python
# (PEP 668, "externally-managed-environment"), so we never touch it.
VENV_DIR="$BACKEND_DIR/.venv"

model_is_downloaded() {
    # True as soon as the model's subfolder holds anything.
    [ -d "$MODEL_DIR" ] && [ -n "$(find "$MODEL_DIR" -mindepth 1 -print -quit 2>/dev/null)" ]
}

ensure_model_downloaded() {
    if model_is_downloaded; then
        echo "Model already present in $MODEL_DIR, skipping download."
        return
    fi

    echo "Model not found in $MODEL_DIR - downloading $MODEL_NAME (this can take a while) ..."

    if [ ! -x "$VENV_DIR/bin/python" ]; then
        echo "Creating virtualenv in $VENV_DIR ..."
        python3 -m venv "$VENV_DIR"
    fi

    "$VENV_DIR/bin/python" -m pip install --quiet --upgrade pip huggingface_hub
    "$VENV_DIR/bin/python" "$BACKEND_DIR/scripts/download_model.py"
}

pick_free_port() {
    # Ask the OS to hand us an unused ephemeral port by binding to port 0.
    python3 -c 'import socket
s = socket.socket()
s.bind(("", 0))
print(s.getsockname()[1])
s.close()'
}

open_browser() {
    local url="$1"
    case "$(uname -s)" in
        Darwin) open "$url" ;;
        Linux) xdg-open "$url" >/dev/null 2>&1 & disown ;;
        MINGW* | MSYS* | CYGWIN*) start "" "$url" ;;
        *) echo "Please open $url manually." ;;
    esac
}

wait_for_backend() {
    local url="$1"
    local retries=120
    until curl -fsS "$url/api/health" >/dev/null 2>&1; do
        retries=$((retries - 1))
        if [ "$retries" -le 0 ]; then
            echo "Backend did not become ready in time." >&2
            return 1
        fi
        sleep 1
    done
}

ensure_model_downloaded

HOST_PORT="$(pick_free_port)"
export HOST_PORT
URL="http://localhost:${HOST_PORT}"

echo "Starting backend, mapped to ${URL} ..."

cd "$BACKEND_DIR"
docker compose up --build -d

cleanup() {
    echo
    echo "Stopping backend..."
    docker compose down
}
trap cleanup EXIT INT TERM

if wait_for_backend "$URL"; then
    echo "Backend is ready. Opening ${URL} ..."
    open_browser "$URL"
else
    echo "--- backend logs ---"
    docker compose logs --tail=100
    exit 1
fi

# Keep the script (and the container) alive in the foreground; Ctrl-C
# triggers the cleanup trap above.
docker compose logs -f
