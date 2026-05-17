# ============================================================
# Multi-stage Dockerfile for Jatai/Watizat App
# Stage 1: Build React frontend
# Stage 2: FastAPI backend serving API + built frontend
# Result: single container with everything
# ============================================================

# ---------- Stage 1: Build React frontend ----------
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock* ./
RUN yarn install --frozen-lockfile --network-timeout 600000

COPY frontend/ ./
# Frontend will call same-origin /api (no need for separate backend URL)
ENV REACT_APP_BACKEND_URL=""
ENV GENERATE_SOURCEMAP=false
ENV CI=false
RUN yarn build


# ---------- Stage 2: Python runtime ----------
FROM python:3.11-slim

# System deps for cryptography + qrcode/pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps first (better layer caching)
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r backend/requirements.txt && \
    pip install --no-cache-dir "qrcode[pil]==7.4.2"

# Copy backend code (includes serve_static.py)
COPY backend/ ./backend/

# Copy frontend build (served by FastAPI in production)
COPY --from=frontend-builder /app/frontend/build ./frontend_build

# Patch server.py to mount frontend static files (only if not already mounted)
RUN python -c "import io; \
content = open('/app/backend/server.py','r').read(); \
patch = '\n\n# === SPA Frontend Mount (production) ===\ntry:\n    from serve_static import mount_frontend\n    mount_frontend(app)\nexcept Exception as _e:\n    print(\"Frontend mount skipped:\", _e)\n'; \
open('/app/backend/server.py','w').write(content + patch) if 'mount_frontend(app)' not in content else None"

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PORT=10000
EXPOSE 10000

WORKDIR /app/backend

# Render injects $PORT - use sh to expand it
CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port ${PORT:-10000}"]
