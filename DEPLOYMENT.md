# Deployment & Infrastructure Guide

## 1. Logical Architecture
* **Web Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide Icons.
* **API & Service Layer**: Next.js API Routes (`app/api/*`) executing server-side logic.
* **Persistence & Identity**: Supabase PostgreSQL with strict Row Level Security (RLS) policies.
* **AI Intelligence Layer**: Server-side Google Gemini Flash API (`@google/genai`) with prompt injection scrubbing and strict schema validation.
* **ML Inference Suite**: Interpretable ML engine (Logistic Regression, Random Forest, GBDT).

## 2. Containerized Deployment
A multi-stage, non-root `Dockerfile` is provided for production environments:
```bash
# Build production Docker image
docker build -t aasra-care-platform:latest .

# Run with docker-compose
docker-compose up -d
```

## 3. Environment Configuration
Ensure `.env.local` or container environment variables are populated:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
GEMINI_API_KEY=AIzaSy...
```

## 4. Health Check Endpoints
Container orchestrators (Kubernetes / Cloud Run) should configure probes against:
* `GET /api/health` — Top-level system status
* `GET /api/health/db` — Supabase database readiness
* `GET /api/health/ai` — Gemini & deterministic fallback status
* `GET /api/health/ml` — ML inference models & leakage status
