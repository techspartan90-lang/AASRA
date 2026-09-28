"""
Voice Acoustic Analyzer Provider for AASRA (Phase 15)

Evaluates:
- Fundamental frequency (F0 pitch mean)
- Speaking rate (words per minute)
- Cumulative speech pause duration & hesitation ratio
- Intensity dynamic range (dB)
- Micro-tremor perturbation index
"""

from typing import Dict, Any, List, Tuple
from .base import BaseAnalyzer


class VoiceAnalyzer(BaseAnalyzer):
    def __init__(self):
        super().__init__(
            model_name="Voice Acoustic Prosody Engine (DEMO MODEL)",
            model_version="demo-voice-wav2vec2-v1.4"
        )

    def _deterministic_demo_inference(self, input_data: Dict[str, Any]) -> Tuple[Dict[str, Any], float, List[str]]:
        has_audio = input_data.get("has_audio", True)
        if not has_audio:
            return {
                "acoustic_distress_score": 0,
                "audio_present": False,
                "note": "No audio sample provided for prosody processing",
            }, 0.50, ["Zero audio input supplied"]

        pitch_hz = input_data.get("pitch_hz", 195.0)
        speaking_rate_wpm = input_data.get("speaking_rate_wpm", 115.0)
        pause_ratio = input_data.get("pause_duration_ratio", 0.25)
        intensity_db = input_data.get("intensity_variance_db", 14.0)
        tremor_index = input_data.get("tremor_index", 0.08)

        score = 28
        signals: List[str] = []

        if pause_ratio is not None and pause_ratio >= 0.35:
            score += 18
            signals.append(f"Elevated speech pause ratio ({int(pause_ratio * 100)}%) indicating hesitance or cognitive load")

        if tremor_index is not None and tremor_index >= 0.20:
            score += 16
            signals.append(f"Acoustic micro-tremor detected ({tremor_index:.2f}) reflecting physiological arousal")

        if speaking_rate_wpm is not None and speaking_rate_wpm < 95.0:
            score += 12
            signals.append(f"Articulatory rate ({int(speaking_rate_wpm)} WPM) significantly below conversational baseline")

        final_distress = min(100, score)
        confidence = 0.84 if signals else 0.70

        analysis = {
            "acoustic_distress_score": final_distress,
            "acoustic_risk_band": "High" if final_distress >= 60 else "Medium" if final_distress >= 40 else "Low",
            "features_extracted": {
                "pitch_hz": pitch_hz,
                "speaking_rate_wpm": speaking_rate_wpm,
                "pause_duration_ratio": pause_ratio,
                "intensity_variance_db": intensity_db,
                "tremor_index": tremor_index,
            },
            "model_type": "DETERMINISTIC_PROSODY_DEMO",
            "clinical_diagnosis": False,
        }

        if not signals:
            signals.append("Vocal acoustic parameters within expected conversational bounds")

        return analysis, confidence, signals
