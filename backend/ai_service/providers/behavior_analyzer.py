"""
Behavioral Engagement Analyzer Provider for AASRA (Phase 15)

Evaluates:
- Missed scheduled check-in pulses
- Engagement attrition (>40% drop in interaction frequency or length)
- Abrupt timing or communication channel shifts
- Multiple urgent support or callback triggers within short intervals
"""

from typing import Dict, Any, List, Tuple
from .base import BaseAnalyzer


class BehaviorAnalyzer(BaseAnalyzer):
    def __init__(self):
        super().__init__(
            model_name="Behavioral Engagement Analyzer (DEMO MODEL)",
            model_version="demo-behavioral-lstm-v1.0"
        )

    def _deterministic_demo_inference(self, input_data: Dict[str, Any]) -> Tuple[Dict[str, Any], float, List[str]]:
        missed = int(input_data.get("missed_checkins_count", 0))
        days_gap = int(input_data.get("days_since_last_interaction", 0))
        declining = bool(input_data.get("declining_engagement", False))
        sudden_change = bool(input_data.get("sudden_interaction_change", False))
        callbacks = int(input_data.get("rapid_support_requests", 0))

        score = 20
        signals: List[str] = []

        if missed >= 2:
            score += min(30, missed * 12)
            signals.append(f"{missed} consecutive scheduled check-ins missed or uncompleted")

        if days_gap >= 3:
            score += 15
            signals.append(f"{days_gap} days elapsed without active survivor interaction")

        if declining:
            score += 15
            signals.append("Gradual engagement attrition (>40% drop from onboarding baseline)")

        if sudden_change:
            score += 10
            signals.append("Abrupt change in customary check-in channel or time window")

        if callbacks >= 2:
            score += 25
            signals.append(f"High-frequency help requests ({callbacks} within 72 hours)")

        final_score = min(100, score)
        confidence = 0.90 if signals else 0.75

        analysis = {
            "behavioral_distress_indicator": final_score,
            "engagement_status": "disengaging" if final_score >= 50 else "nominal",
            "triage_recommendation": (
                "Attempt respectful outreach via secondary channel (SMS/IVR)" if final_score >= 45
                else "Continue routine scheduled monitoring"
            ),
            "model_type": "DETERMINISTIC_BEHAVIORAL_DEMO",
            "clinical_diagnosis": False,
        }

        if not signals:
            signals.append("Stable check-in frequency and routine interaction adherence")

        return analysis, confidence, signals
