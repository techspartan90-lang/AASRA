"""
Pydantic Schemas for AASRA FastAPI AI Service (Phase 15)

Enforces strict request and response contracts:
- analysis (the core payload: scores, trajectories, categories)
- confidence (calibrated float 0.0 - 1.0)
- signals (list of human-understandable contributing signals)
- model_version (semantic versioning string)
- timestamp (ISO-8601 UTC)
- non_clinical_disclaimer (statutory non-medical operational notice)
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


# ============================================================================
# BASE & SHARED SCHEMAS
# ============================================================================

class BaseAIResponse(BaseModel):
    analysis: Dict[str, Any] = Field(..., description="Structured operational analysis output")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model calibration confidence (0.0 - 1.0)")
    signals: List[str] = Field(default_factory=list, description="Human-understandable contributing signals")
    model_version: str = Field(..., description="Unique model identifier and version")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    is_demo_model: bool = Field(True, description="Strictly marked DEMO MODEL for non-clinical development prototype")
    disclaimer: str = Field(
        "DEMO MODEL — Operational distress screening indicator for caseworker prioritization under Section 15A. "
        "Does NOT constitute a medical or clinical diagnosis.",
        description="Mandatory non-clinical disclaimer"
    )


# ============================================================================
# 1. TEXT ANALYSIS SCHEMAS
# ============================================================================

class TextInput(BaseModel):
    text: str = Field(..., min_length=1, description="Raw survivor check-in utterance or message text")
    language: str = Field("hi", description="ISO 639-1 code (hi, en, ta, te, bn, mr, etc.)")
    survivor_id: Optional[str] = Field("usr-victim-001", description="Anonymized survivor identifier")
    context_tags: Optional[List[str]] = Field(default_factory=list, description="Optional tags: e.g. pre_hearing, post_threat")


class TextAnalysisResponse(BaseAIResponse):
    pass


# ============================================================================
# 2. VOICE ACOUSTIC ANALYSIS SCHEMAS
# ============================================================================

class VoiceAcousticsInput(BaseModel):
    has_audio: bool = Field(True, description="Flag indicating presence of audio recording")
    duration_seconds: Optional[float] = Field(None, ge=0.0, description="Length of speech sample in seconds")
    pitch_hz: Optional[float] = Field(None, description="Fundamental frequency F0 mean in Hz")
    pitch_jitter: Optional[float] = Field(None, description="Cycle-to-cycle frequency jitter ratio (0.0 - 0.1)")
    speaking_rate_wpm: Optional[float] = Field(None, description="Calculated words per minute")
    pauses_duration_seconds: Optional[float] = Field(None, description="Cumulative hesitation duration")
    pause_duration_ratio: Optional[float] = Field(None, ge=0.0, le=1.0, description="Ratio of silence/hesitation to total duration")
    intensity_variance_db: Optional[float] = Field(None, description="Vocal loudness dynamic variance in decibels")
    tremor_index: Optional[float] = Field(None, ge=0.0, le=1.0, description="Vocal micro-tremor perturbation index")


class VoiceAnalysisResponse(BaseAIResponse):
    pass


# ============================================================================
# 3. BEHAVIORAL ENGAGEMENT SCHEMAS
# ============================================================================

class BehaviorInput(BaseModel):
    survivor_id: str = Field("usr-victim-001", description="Anonymized survivor identifier")
    missed_checkins_count: int = Field(0, ge=0, description="Count of missed scheduled pulses")
    days_since_last_interaction: int = Field(0, ge=0, description="Days elapsed since last completed touchpoint")
    declining_engagement: bool = Field(False, description="cadence or response length dropped >40%")
    sudden_interaction_change: bool = Field(False, description="Abrupt shift in time of day or communication channel")
    rapid_support_requests: int = Field(0, ge=0, description="Counsellor callback requests triggered within 72h")


class BehaviorAnalysisResponse(BaseAIResponse):
    pass


# ============================================================================
# 4. PREDICTIVE DISTRESS SCHEMAS
# ============================================================================

class DistressPredictionInput(BaseModel):
    survivor_id: str = Field("usr-victim-001", description="Anonymized survivor identifier")
    current_score: int = Field(..., ge=0, le=100, description="Current Dynamic Distress Indicator (0-100)")
    baseline_score: int = Field(..., ge=0, le=100, description="Established personal baseline anchor (0-100)")
    historical_scores: Optional[List[int]] = Field(default_factory=list, description="Past longitudinal scores")
    upcoming_hearing_days: Optional[int] = Field(None, description="Days until next scheduled court testimony")
    threat_reported: bool = Field(False, description="Witness protection report on file")


class DistressPredictionResponse(BaseAIResponse):
    pass


# ============================================================================
# 5. PREDICTIVE RISK SCHEMAS (7, 14, 30 DAYS)
# ============================================================================

class RiskPredictionInput(BaseModel):
    survivor_id: str = Field("usr-victim-001", description="Anonymized survivor identifier")
    prediction_window_days: int = Field(7, description="Forecast window: 7, 14, or 30 days")
    distress_trend: str = Field("rising", description="Trajectory: rising, stable, declining")
    baseline_deviation: int = Field(0, description="Current score minus baseline score")
    checkin_frequency: str = Field("daily", description="daily, alternate_days, weekly")
    engagement_status: str = Field("active", description="active, declining, abrupt_drop")
    text_signals: Optional[List[str]] = Field(default_factory=list)
    voice_jitter: Optional[float] = None
    voice_pause_ratio: Optional[float] = None
    upcoming_hearing_days: Optional[int] = None
    threat_reported: bool = False
    previous_support_interactions: int = Field(1, ge=0)


class RiskPredictionResponse(BaseAIResponse):
    pass


# ============================================================================
# 6. MODEL MONITORING SCHEMAS
# ============================================================================

class ModelMetricSnapshot(BaseModel):
    model_version: str
    total_inferences: int
    avg_inference_latency_ms: float
    latest_inference_latency_ms: float
    avg_confidence: float
    error_count: int
    last_error: Optional[str] = None
    last_invoked_at: Optional[str] = None


class MonitoringSummaryResponse(BaseModel):
    service: str = "AASRA FastAPI AI Distress Analysis Service"
    uptime_seconds: float
    environment: str = "development"
    active_providers: List[str]
    metrics: Dict[str, ModelMetricSnapshot]
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
