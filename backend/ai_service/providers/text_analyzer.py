"""
Text Analyzer Provider for AASRA (Phase 15)

Evaluates:
- Emotional language & affect valence
- Hopelessness & demoralization markers
- Fear & intimidation cues
- Social/interpersonal withdrawal signals
- Potential self-harm signals (requiring immediate caseworker notice)
"""

import re
from typing import Dict, Any, List, Tuple
from .base import BaseAnalyzer


class TextAnalyzer(BaseAnalyzer):
    def __init__(self):
        super().__init__(
            model_name="Text Distress NLP Analyzer (DEMO MODEL)",
            model_version="demo-nlp-bert-v2.1"
        )

    def _deterministic_demo_inference(self, input_data: Dict[str, Any]) -> Tuple[Dict[str, Any], float, List[str]]:
        text = str(input_data.get("text", "")).lower()
        language = input_data.get("language", "en")

        # Multi-category lexicons for demonstration
        hopeless_patterns = [r"\bhopeless\b", r"\bno point\b", r"\bgive up\b", r"\bcan't go on\b", r"\bworthless\b", r"\bनिराश\b", r"\bकोई फायदा नहीं\b"]
        fear_patterns = [r"\bafraid\b", r"\bscared\b", r"\bterrified\b", r"\bthreat\b", r"\bretaliat\b", r"\bdanger\b", r"\bडर\b", r"\bधमकी\b"]
        withdrawal_patterns = [r"\balone\b", r"\bhide\b", r"\bavoid everyone\b", r"\bisolated\b", r"\bcan't face\b", r"\bअकेला\b"]
        self_harm_patterns = [r"\bend it\b", r"\bhurt myself\b", r"\bdie\b", r"\bsuicide\b", r"\bआत्महत्या\b", r"\bमरना\b"]

        score = 25  # Nominal baseline
        signals: List[str] = []
        categories_detected: List[str] = []

        # Check self-harm (highest priority)
        if any(re.search(p, text) for p in self_harm_patterns):
            score += 35
            signals.append("URGENT_REVIEW: Potential self-harm or profound crisis expression detected")
            categories_detected.append("self_harm_marker")

        # Check hopelessness
        if any(re.search(p, text) for p in hopeless_patterns):
            score += 20
            signals.append("Hopelessness or demoralization markers identified in text")
            categories_detected.append("hopelessness")

        # Check fear / threat
        if any(re.search(p, text) for p in fear_patterns):
            score += 20
            signals.append("Fear, acute anxiety, or intimidation context identified in check-in")
            categories_detected.append("fear_intimidation")

        # Check withdrawal
        if any(re.search(p, text) for p in withdrawal_patterns):
            score += 15
            signals.append("Interpersonal avoidance or social withdrawal expressed")
            categories_detected.append("withdrawal")

        final_distress = min(100, score)
        confidence = 0.88 if signals else 0.72

        analysis = {
            "distress_score": final_distress,
            "risk_band": "Critical" if final_distress >= 75 else "High" if final_distress >= 55 else "Medium" if final_distress >= 35 else "Low",
            "categories_detected": categories_detected,
            "language_analyzed": language,
            "sentiment_valence": "negative" if final_distress >= 40 else "neutral",
            "model_type": "DETERMINISTIC_HEURISTIC_DEMO",
            "clinical_diagnosis": False,
        }

        if not signals:
            signals.append("Nominal conversational tone matching baseline check-in history")

        return analysis, confidence, signals
