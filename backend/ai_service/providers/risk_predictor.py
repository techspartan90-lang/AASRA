"""
Risk & Distress Predictor Provider for AASRA (Phase 15)

Generates:
1. Dynamic Distress Indicator projections with baseline comparison (0-100)
2. Longitudinal risk projections across 7-day, 14-day, and 30-day horizons
3. Uncertainty margins and plain-language model explanations
"""

from typing import Dict, Any, List, Tuple
from .base import BaseAnalyzer


class RiskPredictor(BaseAnalyzer):
    def __init__(self):
        super().__init__(
            model_name="Longitudinal Risk & Distress Predictor (DEMO MODEL)",
            model_version="demo-risk-tcn-v1.8"
        )

    def _deterministic_demo_inference(self, input_data: Dict[str, Any]) -> Tuple[Dict[str, Any], float, List[str]]:
        mode = input_data.get("mode", "predict_risk")

        if mode == "predict_distress":
            return self._predict_distress(input_data)
        else:
            return self._predict_risk(input_data)

    def _predict_distress(self, input_data: Dict[str, Any]) -> Tuple[Dict[str, Any], float, List[str]]:
        current_score = int(input_data.get("current_score", 47))
        baseline_score = int(input_data.get("baseline_score", 28))
        hearing_days = input_data.get("upcoming_hearing_days")
        threat_reported = bool(input_data.get("threat_reported", False))

        delta = current_score - baseline_score
        signals: List[str] = []

        if delta > 15:
            signals.append(f"Significant elevation (+{delta} points) above personal baseline ({baseline_score})")
        elif delta > 5:
            signals.append(f"Mild upward shift (+{delta} points) from baseline ({baseline_score})")

        if hearing_days is not None and hearing_days <= 7:
            signals.append(f"Proximity of high-stress judicial milestone (trial in {hearing_days} days)")

        if threat_reported:
            signals.append("Active witness intimidation or protection concern registered")

        category = "Critical" if current_score >= 75 else "High" if current_score >= 50 else "Medium" if current_score >= 35 else "Low"

        analysis = {
            "indicator_name": "Dynamic Distress Indicator",
            "current_score": current_score,
            "baseline_score": baseline_score,
            "delta": delta,
            "risk_category": category,
            "historical_trajectory": "rising" if delta > 5 else "stable" if delta >= -5 else "recovering",
            "clinical_diagnosis": False,
        }

        if not signals:
            signals.append("Longitudinal distress indicator aligns with expected personal baseline")

        return analysis, 0.89, signals

    def _predict_risk(self, input_data: Dict[str, Any]) -> Tuple[Dict[str, Any], float, List[str]]:
        window_days = int(input_data.get("prediction_window_days", 7))
        window_label = f"{window_days} days"
        baseline_dev = int(input_data.get("baseline_deviation", 19))
        hearing_days = input_data.get("upcoming_hearing_days")
        threat_reported = bool(input_data.get("threat_reported", False))
        eng = input_data.get("engagement_status", "active")
        support_count = int(input_data.get("previous_support_interactions", 1))

        signals: List[str] = []
        drivers: List[str] = []

        if baseline_dev >= 15:
            signals.append(f"Elevated baseline deviation (+{baseline_dev} pts)")
            drivers.append("Recent check-in distress surge")

        if hearing_days is not None and hearing_days <= 10:
            signals.append(f"Court testimony date approaching in {hearing_days} days")
            drivers.append(f"Approaching judicial trial milestone ({hearing_days} days)")

        if threat_reported:
            signals.append("Reported threat or witness intimidation incident")
            drivers.append("Active protection incident on record")

        if eng in ["declining", "abrupt_drop"]:
            signals.append("Intermittent check-in response pattern")
            drivers.append("Drop in check-in cadence")

        # Projected risk indicator
        if threat_reported or (hearing_days is not None and hearing_days <= 7 and baseline_dev >= 15):
            projected_risk = f"Elevated distress signal over the next {window_label}."
            rec_action = "Schedule proactive caseworker touchpoint within 48 hours; coordinate legal support."
        elif baseline_dev > 10:
            projected_risk = f"Moderate situational distress fluctuation projected over the next {window_label}."
            rec_action = "Offer gentle grounding resources and maintain regular check-in timetable."
        else:
            projected_risk = f"Stable longitudinal trajectory anticipated over the next {window_label}."
            rec_action = "Maintain standard self-directed check-in schedule."

        # Horizon confidence & uncertainty
        if window_days <= 7:
            confidence = 0.88
            uncertainty_pts = 7.5
        elif window_days <= 14:
            confidence = 0.81
            uncertainty_pts = 12.0
        else:
            confidence = 0.74
            uncertainty_pts = 17.5

        if not drivers:
            drivers.append("Consistent check-in responses matching historical intake baseline")

        driver_str = ", ".join(drivers[:3])
        plain_explanation = (
            f"The model projects an operational indicator over the next {window_label} based primarily on {driver_str}. "
            f"Because predictive models reflect likelihoods rather than certainties, this indicator serves as an operational "
            f"compass to help caseworkers offer timely, respectful support before stressors peak."
        )

        analysis = {
            "prediction_window": window_label,
            "projected_risk_indicator": projected_risk,
            "uncertainty_margin": f"± {uncertainty_pts} pts",
            "plain_language_explanation": plain_explanation,
            "primary_drivers": drivers,
            "recommended_follow_up": rec_action,
            "clinical_diagnosis": False,
        }

        if not signals:
            signals.append("Predictive trajectory stable based on historical response cadence")

        return analysis, confidence, signals
