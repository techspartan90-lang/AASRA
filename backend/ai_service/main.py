"""
FastAPI AI Distress Analysis Service - AASRA Care / Manas Suraksha
Provides multimodal distress screening across:
1. Text Analysis (hopelessness, fear, withdrawal, self-harm indicators)
2. Voice Acoustics (pitch, rate, pauses, intensity, tremor)
3. Behavioral Engagement (missed check-ins, engagement shifts)
4. Case Milestone Context (hearings, threats, delays)

IMPORTANT NON-CLINICAL NOTICE:
This service is an early distress recognition and prioritization prototype.
It NEVER produces definitive psychiatric or medical diagnoses.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import datetime
import math

app = FastAPI(
    title="Manas Suraksha AI Distress Analysis Engine",
    description="Multimodal trauma-informed distress screening service for survivor support pipelines.",
    version="1.0.0",
)

# Enable CORS for local Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# PYDANTIC SCHEMAS
# ============================================================================

class VoiceAcousticInput(BaseModel):
    has_audio: bool = False
    duration_seconds: Optional[float] = None
    pitch_hz: Optional[float] = Field(None, description="Fundamental frequency F0 mean")
    pitch_jitter: Optional[float] = Field(None, description="Cycle-to-cycle frequency variation (0.0 - 0.1)")
    speaking_rate_wpm: Optional[float] = Field(None, description="Words per minute")
    pauses_duration_seconds: Optional[float] = Field(None, description="Cumulative hesitation duration")
    intensity_variance_db: Optional[float] = Field(None, description="Loudness dynamic range in dB")
    tremor_index: Optional[float] = Field(None, description="Micro-tremor amplitude perturbation index (0.0 - 1.0)")


class BehavioralInput(BaseModel):
    missed_check_ins: int = Field(0, description="Count of missed scheduled pulses")
    declining_engagement: bool = Field(False, description="Response length or cadence drop > 40%")
    sudden_interaction_change: bool = Field(False, description="Abrupt shift from historical baseline time/channel")
    repeated_support_requests: int = Field(0, description="Support callback requests within 72h")


class CaseMilestoneInput(BaseModel):
    hearing_date_proximity_days: Optional[int] = Field(None, description="Days until next scheduled court hearing")
    investigation_status: Optional[str] = Field("active", description="e.g. active, chargesheet_filed, delayed")
    rehabilitation_event_scheduled: bool = Field(False)
    reported_threats_present: bool = Field(False, description="Witness protection or intimidation report on record")
    case_delay_months: Optional[int] = Field(0, description="Administrative or trial delays")


class DistressAnalysisRequest(BaseModel):
    survivor_id: str = "usr-victim-001"
    language: str = "hi"
    mood_response: Optional[str] = "Okay"
    text_response: Optional[str] = ""
    voice_acoustics: Optional[VoiceAcousticInput] = None
    behavioral_context: Optional[BehavioralInput] = None
    milestone_context: Optional[CaseMilestoneInput] = None
    baseline_indicator: Optional[float] = 50.0


class ContributingSignal(BaseModel):
    category: str  # text, voice, behavioral, milestone
    signal: str
    weight: float  # contribution percentage or points
    human_explanation: str


class DistressAnalysisResponse(BaseModel):
    distress_indicator: int = Field(..., ge=0, le=100, description="Continuous distress recognition index 0-100")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model calibration confidence")
    contributing_signals: List[str] = Field(..., description="Human-readable contributing signals")
    trend_change: str = Field(..., description="Deviation comparison from baseline/historical trend")
    recommended_follow_up: str = Field(..., description="Actionable human caseworker follow-up pathway")
    detailed_signals: List[ContributingSignal] = []
    non_clinical_disclaimer: str = (
        "Non-clinical screening prototype. This indicator identifies elevated distress patterns "
        "to assist caseworker prioritization and does not constitute a psychiatric or medical diagnosis."
    )
    timestamp: str = Field(default_factory=lambda: datetime.datetime.utcnow().isoformat() + "Z")


# ============================================================================
# PHASE 7: PREDICTIVE RISK MODELLING SCHEMAS
# ============================================================================

class PredictiveRiskRequest(BaseModel):
    survivor_id: str = "usr-victim-001"
    prediction_window: str = Field("7 days", description="Prediction horizon: '7 days', '14 days', or '30 days'")
    distress_trend: Optional[List[float]] = Field(
        default_factory=lambda: [32.0, 36.0, 41.0, 48.0, 47.0],
        description="Historical or recent longitudinal distress score points"
    )
    baseline_deviation: float = Field(19.0, description="Deviation from personal baseline in points (e.g. +19.0)")
    check_in_frequency: str = Field("daily", description="Cadence: 'daily', 'every few days', 'weekly', 'sporadic'")
    engagement_change: str = Field("declining", description="Change in engagement: 'stable', 'declining', 'improving', 'abrupt_drop'")
    text_signals: List[str] = Field(
        default_factory=lambda: ["court hearing anxiety", "sleep disruption"],
        description="Extracted text distress markers"
    )
    voice_feature_metadata: Optional[VoiceAcousticInput] = None
    case_milestone_context: Optional[CaseMilestoneInput] = None
    previous_support_interactions: int = Field(3, description="Count of prior counsellor sessions or support interactions")
    input_version: str = Field("inp-v2.4", description="Schema version of incoming features")


class ModelVersionTracking(BaseModel):
    model_version: str = "aasra-predictive-v1.4.2"
    prediction_timestamp: str = Field(default_factory=lambda: datetime.datetime.utcnow().isoformat() + "Z")
    prediction_window: str = "7 days"
    prediction_output: str
    confidence: float
    input_version: str


class UncertaintyIndicator(BaseModel):
    level: str = Field(..., description="'Low', 'Moderate', or 'High'")
    variance_margin_pts: float = Field(..., description="Estimated margin of error in points (e.g. ±8.5 pts)")
    description: str = Field(..., description="Accessible non-certainty explanation of predictive confidence boundaries")


class ModelExplanation(BaseModel):
    headline: str = "Why did the indicator change?"
    plain_language_summary: str = Field(..., description="Accessible narrative explanation using plain language")
    primary_drivers: List[str] = Field(..., description="Bullet list of main influencing variables")


class PredictiveRiskResponse(BaseModel):
    risk_indicator: str = Field(..., description="Operational predictive distress statement (e.g. 'Elevated distress signal over the next 7 days.')")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Calibrated probabilistic confidence [0.0 - 1.0]")
    time_horizon: str = Field(..., description="'7 days', '14 days', or '30 days'")
    contributing_factors: List[str] = Field(..., description="Human-readable contributing factors")
    recommended_follow_up: str = Field(..., description="Trauma-informed, non-coercive operational recommendation")
    uncertainty_indicator: UncertaintyIndicator
    model_explanation: ModelExplanation
    model_version_tracking: ModelVersionTracking
    non_clinical_disclaimer: str = (
        "Operational prediction prototype. Estimates future distress likelihood to support proactive caseworker outreach. "
        "Predictions are probabilistic indicators and NOT clinical certainties, medical diagnoses, or psychiatric forecasts."
    )


# ============================================================================
# ANALYSIS MODULE IMPLEMENTATIONS
# ============================================================================

def analyze_text(text: Optional[str]) -> Dict[str, Any]:
    """Analyzes text for emotional language, fear, hopelessness, withdrawal, and self-harm markers."""
    if not text or not text.strip():
        return {"score_delta": 0, "signals": [], "self_harm_flag": False}

    lower = text.lower()
    score_delta = 0
    signals = []
    self_harm_flag = False

    # Hopelessness indicators
    hopeless_terms = ["hopeless", "give up", "can't go on", "no point", "exhausted", "alone", "darkness", "thak gayi", "koi rasta nahi"]
    if any(t in lower for t in hopeless_terms):
        score_delta += 14
        signals.append("Hopelessness-related expressions detected in reflection")

    # Fear & Anxiety indicators
    fear_terms = ["scared", "threat", "afraid", "unsafe", "kill", "men outside", "attack", "police", "court", "dar lag raha", "khatra"]
    if any(t in lower for t in fear_terms):
        score_delta += 16
        signals.append("Fear and environmental security anxiety language present")

    # Withdrawal indicators
    withdrawal_terms = ["leaving", "don't want to talk", "stop asking", "isolate", "locked room", "bandh kar do"]
    if any(t in lower for t in withdrawal_terms):
        score_delta += 10
        signals.append("Social withdrawal and avoidance patterns indicated in text")

    # Potential self-harm indicators
    self_harm_terms = ["end my life", "suicide", "harm myself", "better off dead", "mar jana", "khudkushi"]
    if any(t in lower for t in self_harm_terms):
        score_delta += 30
        self_harm_flag = True
        signals.append("Critical safety review marker flagged (Requires immediate caseworker protocol)")

    # Emotional grounding / positive language
    positive_terms = ["calm", "better", "peace", "support", "slept well", "shanti", "theek hu"]
    if any(t in lower for t in positive_terms):
        score_delta -= 10
        signals.append("Calming and positive emotional stability markers present")

    return {
        "score_delta": score_delta,
        "signals": signals,
        "self_harm_flag": self_harm_flag,
    }


def analyze_voice(voice: Optional[VoiceAcousticInput]) -> Dict[str, Any]:
    """Analyzes acoustic signals: pitch jitter, speaking rate, pauses, intensity variance, tremor."""
    if not voice or not voice.has_audio:
        return {"score_delta": 0, "signals": []}

    score_delta = 0
    signals = []

    # Tremor & Frequency perturbation
    if voice.pitch_jitter and voice.pitch_jitter > 0.04:
        score_delta += 8
        signals.append(f"Elevated pitch jitter ({voice.pitch_jitter * 100:.1f}%) reflecting vocal tension")

    if voice.tremor_index and voice.tremor_index > 0.45:
        score_delta += 10
        signals.append(f"Acoustic micro-tremor index elevated at {voice.tremor_index:.2f}")

    # Prolonged hesitation pauses
    if voice.pauses_duration_seconds and voice.pauses_duration_seconds > 4.0:
        score_delta += 6
        signals.append(f"Prolonged hesitation pauses ({voice.pauses_duration_seconds:.1f}s) indicating cognitive fatigue")

    # Speaking rate slowing (psychomotor deceleration)
    if voice.speaking_rate_wpm and voice.speaking_rate_wpm < 95:
        score_delta += 6
        signals.append(f"Reduced speaking cadence ({voice.speaking_rate_wpm:.0f} WPM) suggesting psychomotor withdrawal")

    return {"score_delta": score_delta, "signals": signals}


def analyze_behavior(beh: Optional[BehavioralInput]) -> Dict[str, Any]:
    """Analyzes behavioral engagement: missed pulses, engagement drop, sudden shifts, repeated calls."""
    if not beh:
        return {"score_delta": 0, "signals": []}

    score_delta = 0
    signals = []

    if beh.missed_check_ins > 0:
        penalty = min(beh.missed_check_ins * 6, 18)
        score_delta += penalty
        signals.append(f"{beh.missed_check_ins} missed routine check-in(s) in recent cadence")

    if beh.declining_engagement:
        score_delta += 8
        signals.append("Declining engagement depth and shortened interaction response times")

    if beh.sudden_interaction_change:
        score_delta += 6
        signals.append("Sudden shift in preferred interaction hours or response channels")

    if beh.repeated_support_requests >= 2:
        score_delta += 12
        signals.append(f"Multiple ({beh.repeated_support_requests}) assistance requests submitted in past 72 hours")

    return {"score_delta": score_delta, "signals": signals}


def analyze_milestones(mile: Optional[CaseMilestoneInput]) -> Dict[str, Any]:
    """Analyzes contextual judicial stressors: court dates, delays, threat reports."""
    if not mile:
        return {"score_delta": 0, "signals": []}

    score_delta = 0
    signals = []

    if mile.hearing_date_proximity_days is not None:
        if mile.hearing_date_proximity_days <= 3:
            score_delta += 18
            signals.append(f"Court hearing scheduled within {mile.hearing_date_proximity_days} days (High situational stressor)")
        elif mile.hearing_date_proximity_days <= 7:
            score_delta += 8
            signals.append(f"Approaching court hearing in {mile.hearing_date_proximity_days} days")

    if mile.reported_threats_present:
        score_delta += 20
        signals.append("Active witness intimidation or protection concern recorded in legal registry")

    if mile.case_delay_months and mile.case_delay_months >= 3:
        score_delta += 5
        signals.append(f"Extended procedural case delay of {mile.case_delay_months} months")

    return {"score_delta": score_delta, "signals": signals}


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "manas-suraksha-ai-distress",
        "inference_engine": "mock_fastapi_multimodal_v1",
        "diagnostic_disclaimer": "strictly_non_clinical",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
    }


@app.post("/analyze-distress", response_model=DistressAnalysisResponse)
def analyze_distress(req: DistressAnalysisRequest):
    """
    Multimodal AI Distress Inference Endpoint.
    Combines text, voice acoustics, behavioral engagement, and judicial milestones.
    Returns human-explainable signals and recommended follow-up.
    """
    # 1. Base anchor from mood
    mood_map = {
        "calm": 20,
        "okay": 35,
        "worried": 55,
        "overwhelmed": 70,
        "need support": 78,
        "very distressed": 82,
    }
    mood_key = (req.mood_response or "okay").lower().strip()
    base_score = mood_map.get(mood_key, 40)

    # 2. Run Module Analyzers
    text_res = analyze_text(req.text_response)
    voice_res = analyze_voice(req.voice_acoustics)
    beh_res = analyze_behavior(req.behavioral_context)
    mile_res = analyze_milestones(req.milestone_context)

    # 3. Fuse scores
    raw_total = (
        base_score
        + text_res["score_delta"]
        + voice_res["score_delta"]
        + beh_res["score_delta"]
        + mile_res["score_delta"]
    )
    final_indicator = max(10, min(95, raw_total))

    # 4. Compile human-readable signals
    all_signals: List[str] = []
    detailed_signals: List[ContributingSignal] = []

    for s in text_res["signals"]:
        all_signals.append(s)
        detailed_signals.append(ContributingSignal(
            category="Text Analysis",
            signal=s,
            weight=text_res["score_delta"],
            human_explanation="Linguistic expression of fear, anxiety, or emotional exhaustion in text."
        ))

    for s in voice_res["signals"]:
        all_signals.append(s)
        detailed_signals.append(ContributingSignal(
            category="Voice Acoustics",
            signal=s,
            weight=voice_res["score_delta"],
            human_explanation="Acoustic tension, tremor perturbation, and hesitation pause duration."
        ))

    for s in beh_res["signals"]:
        all_signals.append(s)
        detailed_signals.append(ContributingSignal(
            category="Behavioral Cadence",
            signal=s,
            weight=beh_res["score_delta"],
            human_explanation="Shifts in routine engagement, missed check-ins, or repeated callback requests."
        ))

    for s in mile_res["signals"]:
        all_signals.append(s)
        detailed_signals.append(ContributingSignal(
            category="Case Milestone",
            signal=s,
            weight=mile_res["score_delta"],
            human_explanation="External situational stressors such as upcoming court hearing dates or reported threats."
        ))

    if not all_signals:
        all_signals.append("Consistent routine check-in within expected emotional baseline boundaries.")

    # 5. Trend change calculation
    baseline = req.baseline_indicator or 50.0
    delta = final_indicator - baseline
    if delta > 12:
        trend_change = f"+{delta:.0f} pts elevated from 30-day intake baseline ({baseline:.0f})"
    elif delta < -12:
        trend_change = f"{delta:.0f} pts improved emotional stability from baseline ({baseline:.0f})"
    else:
        trend_change = f"Steady (within ±{abs(delta):.0f} pts of {baseline:.0f} baseline)"

    # 6. Actionable Recommended Follow-Up
    if text_res.get("self_harm_flag"):
        recommended_follow_up = "Initiate immediate priority caseworker follow-up and offer 24x7 Tele-MANAS (14416) connection."
    elif final_indicator >= 75:
        recommended_follow_up = "Schedule priority check-in call with Dr. Priya Nair prior to the upcoming hearing milestone."
    elif final_indicator >= 55:
        recommended_follow_up = "Maintain routine 3-day wellness cadence and share pre-trial grounding audio exercises."
    else:
        recommended_follow_up = "Continue self-directed check-in schedule; survivor reports balanced emotional stamina."

    return DistressAnalysisResponse(
        distress_indicator=final_indicator,
        confidence=0.91,
        contributing_signals=all_signals,
        trend_change=trend_change,
        recommended_follow_up=recommended_follow_up,
        detailed_signals=detailed_signals,
    )


# ============================================================================
# PHASE 7: PREDICTIVE RISK MODELLING ENGINE & AUDIT STORE
# ============================================================================

PREDICTION_AUDIT_LOG: List[ModelVersionTracking] = []


def sanitize_predictive_language(text: str) -> str:
    """Enforces ethical non-certainty and trauma-informed safety rules."""
    prohibited_certainty_patterns = [
        ("will become suicidal", "may experience heightened situational distress"),
        ("is going to commit suicide", "shows elevated vulnerability indicators"),
        ("will definitely", "is projected to potentially"),
        ("guaranteed to", "indicates likelihood of"),
        ("will decompensate", "may experience increased emotional fatigue"),
        ("certain to relapse", "presents elevated risk markers requiring proactive care"),
    ]
    sanitized = text
    for bad, replacement in prohibited_certainty_patterns:
        sanitized = sanitized.replace(bad, replacement)
        sanitized = sanitized.replace(bad.capitalize(), replacement.capitalize())
    return sanitized


@app.post("/predict-risk", response_model=PredictiveRiskResponse)
def predict_risk(req: PredictiveRiskRequest):
    """
    FastAPI endpoint for Phase 7: Predictive Risk Modelling.
    Projects operational risk across 7-day, 14-day, or 30-day time horizons.
    Inputs:
    - distress trend
    - baseline deviation
    - check-in frequency
    - engagement change
    - text signals
    - voice feature metadata
    - case milestone context
    - previous support interactions
    """
    valid_windows = ["7 days", "14 days", "30 days"]
    window = req.prediction_window if req.prediction_window in valid_windows else "7 days"

    # 1. Base Score projection from recent trend & baseline deviation
    trend = req.distress_trend or [40.0]
    recent_score = trend[-1] if len(trend) > 0 else 45.0
    trend_slope = (trend[-1] - trend[0]) if len(trend) > 1 else 0.0

    contributing_factors: List[str] = []
    primary_drivers: List[str] = []

    # 2. Factor: Baseline deviation
    if req.baseline_deviation > 15:
        contributing_factors.append(f"Significant positive baseline deviation (+{req.baseline_deviation:.0f} pts above intake baseline)")
        primary_drivers.append("Sustained elevation above personal intake baseline")
    elif req.baseline_deviation > 5:
        contributing_factors.append(f"Moderate baseline deviation (+{req.baseline_deviation:.0f} pts)")
    elif req.baseline_deviation < -5:
        contributing_factors.append(f"Favorable baseline deviation ({req.baseline_deviation:.0f} pts below intake)")
        primary_drivers.append("Positive recovery trajectory below initial baseline")

    # 3. Factor: Engagement & Check-in frequency
    eng = req.engagement_change.lower()
    if eng == "abrupt_drop":
        contributing_factors.append("Abrupt reduction in check-in responsiveness (>50% drop)")
        primary_drivers.append("Sudden cessation of routine check-in pulses")
    elif eng == "declining":
        contributing_factors.append("Gradual declining engagement across active check-in channels")
        primary_drivers.append("Declining interaction frequency over recent days")

    if req.check_in_frequency.lower() == "sporadic":
        contributing_factors.append("Sporadic or irregular check-in intervals")

    # 4. Factor: Lexical text markers
    for sig in req.text_signals:
        contributing_factors.append(f"Text signal: {sig}")
    if any("anxiety" in s.lower() or "fear" in s.lower() for s in req.text_signals):
        primary_drivers.append("Linguistic anxiety markers in recent reflections")

    # 5. Factor: Acoustic voice features
    if req.voice_feature_metadata and req.voice_feature_metadata.has_audio:
        if req.voice_feature_metadata.pitch_jitter and req.voice_feature_metadata.pitch_jitter > 0.04:
            contributing_factors.append(f"Vocal jitter perturbation ({req.voice_feature_metadata.pitch_jitter * 100:.1f}%) reflecting acoustic tension")
            primary_drivers.append("Acoustic indicators of physiological stress in audio notes")

    # 6. Factor: Judicial Case Milestones
    upcoming_hearing = False
    threat_reported = False
    if req.case_milestone_context:
        if req.case_milestone_context.hearing_date_proximity_days is not None:
            days = req.case_milestone_context.hearing_date_proximity_days
            if days <= 7:
                upcoming_hearing = True
                contributing_factors.append(f"Approaching court hearing in {days} calendar days")
                primary_drivers.append(f"Upcoming judicial hearing milestone ({days} days away)")
            elif days <= 14 and window in ["14 days", "30 days"]:
                contributing_factors.append(f"Scheduled hearing in {days} calendar days")
                primary_drivers.append("Mid-term judicial calendar milestone")

        if req.case_milestone_context.reported_threats_present:
            threat_reported = True
            contributing_factors.append("Active witness intimidation or protection concern registered")
            primary_drivers.append("Reported security concern in case registry")

    # 7. Factor: Protective interactions
    if req.previous_support_interactions >= 3:
        contributing_factors.append(f"Protective buffer: {req.previous_support_interactions} recent counsellor consultations on record")
    elif req.previous_support_interactions == 0:
        contributing_factors.append("Absence of recent counsellor support interactions")
        primary_drivers.append("Limited active counsellor engagement to date")

    # 8. Synthesize Risk Indicator & Recommended Follow-up based on Time Horizon
    if threat_reported or (upcoming_hearing and req.baseline_deviation >= 15):
        risk_indicator = f"Elevated distress signal over the next {window}."
        rec_follow_up = (
            f"Schedule proactive caseworker touchpoint within 48 hours; coordinate with legal advocate "
            f"prior to hearing milestone and confirm emergency contact availability."
        )
    elif req.baseline_deviation > 10 or eng in ["declining", "abrupt_drop"]:
        risk_indicator = f"Moderate situational distress fluctuation projected over the next {window}."
        rec_follow_up = (
            f"Offer optional mid-week grounding audio note via preferred channel ({req.check_in_frequency}); "
            f"maintain non-intrusive monitoring."
        )
    else:
        risk_indicator = f"Stable longitudinal trajectory anticipated over the next {window}."
        rec_follow_up = "Maintain standard self-directed check-in schedule; no escalated caseworker triage needed."

    # Enforce non-certainty safety filter
    risk_indicator = sanitize_predictive_language(risk_indicator)

    # 9. Horizon-Specific Confidence & Uncertainty Indicator
    if window == "7 days":
        confidence = 0.88
        uncertainty = UncertaintyIndicator(
            level="Low to Moderate",
            variance_margin_pts=7.5,
            description="Dense near-term multi-channel signals provide tightly bounded probabilistic projections (±7.5 pts)."
        )
    elif window == "14 days":
        confidence = 0.81
        uncertainty = UncertaintyIndicator(
            level="Moderate",
            variance_margin_pts=12.0,
            description="Intermediate horizon subject to legal hearing scheduling and voluntary survivor participation (±12.0 pts)."
        )
    else:  # 30 days
        confidence = 0.74
        uncertainty = UncertaintyIndicator(
            level="Elevated",
            variance_margin_pts=17.5,
            description="Longer horizon introduces judicial calendar shifts and external environmental variables (±17.5 pts)."
        )

    # Adjust uncertainty if engagement dropped
    if eng in ["declining", "abrupt_drop"]:
        uncertainty.variance_margin_pts = round(uncertainty.variance_margin_pts + 3.0, 1)

    # 10. Plain Language Model Explanation: "Why did the indicator change?"
    if not primary_drivers:
        primary_drivers.append("Consistent check-in responses matching historical intake baseline")

    driver_narrative = ", ".join(primary_drivers[:3])
    plain_language_summary = (
        f"The model projects an operational indicator over the next {window} based primarily on {driver_narrative}. "
        f"Because predictive models reflect likelihoods rather than certainties, this indicator serves as an operational "
        f"compass to help caseworkers offer timely, respectful support before stressors peak."
    )

    # 11. Model Version Tracking Store
    tracking_record = ModelVersionTracking(
        model_version="aasra-predictive-v1.4.2",
        prediction_timestamp=datetime.datetime.utcnow().isoformat() + "Z",
        prediction_window=window,
        prediction_output=risk_indicator,
        confidence=confidence,
        input_version=req.input_version,
    )
    PREDICTION_AUDIT_LOG.append(tracking_record)

    return PredictiveRiskResponse(
        risk_indicator=risk_indicator,
        confidence=confidence,
        time_horizon=window,
        contributing_factors=contributing_factors,
        recommended_follow_up=rec_follow_up,
        uncertainty_indicator=uncertainty,
        model_explanation=ModelExplanation(
            headline="Why did the indicator change?",
            plain_language_summary=plain_language_summary,
            primary_drivers=primary_drivers,
        ),
        model_version_tracking=tracking_record,
    )


@app.get("/prediction-audit-log", response_model=List[ModelVersionTracking])
def get_prediction_audit_log():
    """Returns stored predictive model audit records for administrative provenance."""
    return PREDICTION_AUDIT_LOG[-25:]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

