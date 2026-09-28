"""
PHASE 15: FASTAPI AI SERVICE - AASRA Platform / Manas Suraksha

Core Endpoints:
- GET  /health
- POST /analyze/text
- POST /analyze/voice
- POST /analyze/behavior
- POST /predict/distress
- POST /predict/risk
- GET  /monitoring/metrics

Features:
- Pydantic models with strict request/response validation
- AI Provider Abstraction (BaseAnalyzer, TextAnalyzer, VoiceAnalyzer, BehaviorAnalyzer, RiskPredictor)
- Deterministic mock inference for development, clearly labelled "DEMO MODEL"
- Replacement interface for real production ML models (PyTorch / ONNX / HuggingFace / Vertex AI)
- Mandatory contract: returns analysis, confidence, signals, model_version, timestamp
- Non-clinical disclaimers (zero fabricated clinical validation)
- Model monitoring hooks: model version, inference latency, confidence, errors
"""

import time
import datetime
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List

from .schemas import (
    TextInput,
    TextAnalysisResponse,
    VoiceAcousticsInput,
    VoiceAnalysisResponse,
    BehaviorInput,
    BehaviorAnalysisResponse,
    DistressPredictionInput,
    DistressPredictionResponse,
    RiskPredictionInput,
    RiskPredictionResponse,
    MonitoringSummaryResponse,
)
from .providers import (
    BaseAnalyzer,
    RealModelAdapter,
    TextAnalyzer,
    VoiceAnalyzer,
    BehaviorAnalyzer,
    RiskPredictor,
)
from .monitoring import monitor

app = FastAPI(
    title="AASRA FastAPI AI Distress Analysis Service",
    description="Multimodal trauma-informed distress screening service under SC/ST PoA Act Section 15A & DPDPA 2023.",
    version="1.5.0",
)

# Enable CORS for local Next.js frontend and Express backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate AI Provider singletons
text_analyzer = TextAnalyzer()
voice_analyzer = VoiceAnalyzer()
behavior_analyzer = BehaviorAnalyzer()
risk_predictor = RiskPredictor()


# ============================================================================
# 1. HEALTH ENDPOINT
# ============================================================================

@app.get("/health")
def health_check():
    """
    Returns AI service health, active providers, and DEMO MODEL status.
    """
    return {
        "status": "HEALTHY",
        "service": "AASRA FastAPI AI Distress Analysis Service",
        "version": "1.5.0",
        "environment": "development",
        "is_demo_model": True,
        "mode_label": "DEMO MODEL",
        "model_versions": {
            "text_analyzer": text_analyzer.model_version,
            "voice_analyzer": voice_analyzer.model_version,
            "behavior_analyzer": behavior_analyzer.model_version,
            "risk_predictor": risk_predictor.model_version,
        },
        "disclaimer": "DEMO MODEL prototype for non-clinical operational testing. No clinical validation claimed.",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
    }


# ============================================================================
# 2. /analyze/text
# ============================================================================

@app.post("/analyze/text", response_model=TextAnalysisResponse)
def analyze_text(payload: TextInput):
    """
    Analyzes emotional language, distress indicators, hopelessness, fear, and self-harm markers.
    """
    analysis, confidence, signals = text_analyzer.analyze(payload.model_dump())

    return TextAnalysisResponse(
        analysis=analysis,
        confidence=confidence,
        signals=signals,
        model_version=text_analyzer.model_version,
        is_demo_model=text_analyzer.is_demo_model,
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",
    )


# ============================================================================
# 3. /analyze/voice
# ============================================================================

@app.post("/analyze/voice", response_model=VoiceAnalysisResponse)
def analyze_voice(payload: VoiceAcousticsInput):
    """
    Analyzes pitch, speaking rate, cumulative pauses, intensity, and acoustic tremor features.
    """
    analysis, confidence, signals = voice_analyzer.analyze(payload.model_dump())

    return VoiceAnalysisResponse(
        analysis=analysis,
        confidence=confidence,
        signals=signals,
        model_version=voice_analyzer.model_version,
        is_demo_model=voice_analyzer.is_demo_model,
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",
    )


# ============================================================================
# 4. /analyze/behavior
# ============================================================================

@app.post("/analyze/behavior", response_model=BehaviorAnalysisResponse)
def analyze_behavior(payload: BehaviorInput):
    """
    Analyzes behavioral signals: missed check-ins, declining engagement, and sudden pattern shifts.
    """
    analysis, confidence, signals = behavior_analyzer.analyze(payload.model_dump())

    return BehaviorAnalysisResponse(
        analysis=analysis,
        confidence=confidence,
        signals=signals,
        model_version=behavior_analyzer.model_version,
        is_demo_model=behavior_analyzer.is_demo_model,
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",
    )


# ============================================================================
# 5. /predict/distress
# ============================================================================

@app.post("/predict/distress", response_model=DistressPredictionResponse)
def predict_distress(payload: DistressPredictionInput):
    """
    Predicts Dynamic Distress Indicator (0-100) and delta comparison with personal baseline.
    """
    input_data = payload.model_dump()
    input_data["mode"] = "predict_distress"
    analysis, confidence, signals = risk_predictor.analyze(input_data)

    return DistressPredictionResponse(
        analysis=analysis,
        confidence=confidence,
        signals=signals,
        model_version=risk_predictor.model_version,
        is_demo_model=risk_predictor.is_demo_model,
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",
    )


# ============================================================================
# 6. /predict/risk
# ============================================================================

@app.post("/predict/risk", response_model=RiskPredictionResponse)
def predict_risk(payload: RiskPredictionInput):
    """
    Generates multi-horizon risk trajectory (7, 14, 30 days) with uncertainty and plain explanation.
    """
    input_data = payload.model_dump()
    input_data["mode"] = "predict_risk"
    analysis, confidence, signals = risk_predictor.analyze(input_data)

    return RiskPredictionResponse(
        analysis=analysis,
        confidence=confidence,
        signals=signals,
        model_version=risk_predictor.model_version,
        is_demo_model=risk_predictor.is_demo_model,
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",
    )


# ============================================================================
# 7. MODEL MONITORING HOOKS
# ============================================================================

@app.get("/monitoring/metrics", response_model=MonitoringSummaryResponse)
def get_monitoring_metrics():
    """
    Returns real-time inference telemetry: model versions, latency (ms), confidence, and error counts.
    """
    return monitor.get_summary()


# ============================================================================
# RUN STANDALONE
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.ai_service.main:app", host="127.0.0.1", port=8000, reload=True)
