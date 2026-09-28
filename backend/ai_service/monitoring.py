"""
Model Monitoring Hooks for AASRA AI Service (Phase 15)

Tracks for all active analyzers and predictors:
- model version
- inference latency (ms)
- confidence distribution
- errors (counts, timestamps, descriptions)
"""

import time
import datetime
from typing import Dict, List, Optional
from collections import defaultdict
from .schemas import ModelMetricSnapshot, MonitoringSummaryResponse

START_TIME = time.time()


class ModelMonitor:
    def __init__(self):
        self._counts: Dict[str, int] = defaultdict(int)
        self._latencies: Dict[str, List[float]] = defaultdict(list)
        self._confidences: Dict[str, List[float]] = defaultdict(list)
        self._errors: Dict[str, List[Dict[str, str]]] = defaultdict(list)
        self._last_invoked: Dict[str, str] = {}
        self._active_providers: List[str] = [
            "TextAnalyzer (DEMO MODEL)",
            "VoiceAnalyzer (DEMO MODEL)",
            "BehaviorAnalyzer (DEMO MODEL)",
            "RiskPredictor (DEMO MODEL)",
        ]

    def record_inference(self, model_version: str, latency_ms: float, confidence: float):
        """Records a successful inference execution."""
        self._counts[model_version] += 1
        # Keep last 500 samples for rolling window
        self._latencies[model_version].append(latency_ms)
        if len(self._latencies[model_version]) > 500:
            self._latencies[model_version].pop(0)

        self._confidences[model_version].append(confidence)
        if len(self._confidences[model_version]) > 500:
            self._confidences[model_version].pop(0)

        self._last_invoked[model_version] = datetime.datetime.utcnow().isoformat() + "Z"

    def record_error(self, model_version: str, error_message: str):
        """Records an inference failure or runtime exception."""
        self._errors[model_version].append({
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "error": error_message,
        })
        if len(self._errors[model_version]) > 50:
            self._errors[model_version].pop(0)

    def get_summary(self) -> MonitoringSummaryResponse:
        """Returns consolidated metrics across all models."""
        uptime = time.time() - START_TIME
        metrics: Dict[str, ModelMetricSnapshot] = {}

        all_models = set(list(self._counts.keys()) + list(self._errors.keys()))
        for mv in all_models:
            lats = self._latencies.get(mv, [])
            confs = self._confidences.get(mv, [])
            errs = self._errors.get(mv, [])

            avg_lat = sum(lats) / len(lats) if lats else 0.0
            latest_lat = lats[-1] if lats else 0.0
            avg_conf = sum(confs) / len(confs) if confs else 0.0
            last_err = errs[-1]["error"] if errs else None

            metrics[mv] = ModelMetricSnapshot(
                model_version=mv,
                total_inferences=self._counts.get(mv, 0),
                avg_inference_latency_ms=round(avg_lat, 2),
                latest_inference_latency_ms=round(latest_lat, 2),
                avg_confidence=round(avg_conf, 3),
                error_count=len(errs),
                last_error=last_err,
                last_invoked_at=self._last_invoked.get(mv),
            )

        return MonitoringSummaryResponse(
            uptime_seconds=round(uptime, 2),
            active_providers=self._active_providers,
            metrics=metrics,
        )


# Global singleton monitor
monitor = ModelMonitor()
