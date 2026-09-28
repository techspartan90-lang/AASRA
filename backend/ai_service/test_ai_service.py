"""
Unit & Integration Test Suite for AASRA FastAPI AI Service (Phase 15)

Validates:
1. /health endpoint and DEMO MODEL labelling
2. /analyze/text endpoint (emotional language, hopelessness, fear, self-harm signals)
3. /analyze/voice endpoint (pitch, speech rate, pauses, tremor)
4. /analyze/behavior endpoint (missed check-ins, engagement drop)
5. /predict/distress endpoint (Dynamic Distress Indicator 0-100 & baseline delta)
6. /predict/risk endpoint (7/14/30 days forecast with uncertainty & plain explanation)
7. AI Provider Abstraction (BaseAnalyzer, RealModelAdapter substitution)
8. Model Monitoring Hooks (/monitoring/metrics, latency, confidence, error logging)
9. Non-clinical disclaimers (zero fabricated clinical validation)
"""

import sys
import os
import unittest
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.ai_service.main import app, text_analyzer, voice_analyzer, behavior_analyzer, risk_predictor
from backend.ai_service.providers import RealModelAdapter
from backend.ai_service.monitoring import monitor


class TestFastAPIAIService(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    # 1. Health check
    def test_01_health_endpoint(self):
        resp = self.client.get("/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "HEALTHY")
        self.assertEqual(data["mode_label"], "DEMO MODEL")
        self.assertTrue(data["is_demo_model"])
        self.assertIn("text_analyzer", data["model_versions"])
        self.assertIn("voice_analyzer", data["model_versions"])
        self.assertIn("behavior_analyzer", data["model_versions"])
        self.assertIn("risk_predictor", data["model_versions"])
        self.assertIn("No clinical validation", data["disclaimer"])
        print("  [PASS] Test 1 Passed: /health returns HEALTHY status with DEMO MODEL labels")

    # 2. Text analysis
    def test_02_analyze_text(self):
        payload = {
            "text": "I feel terrified and hopeless about the upcoming hearing testimony",
            "language": "en",
            "survivor_id": "usr-victim-001"
        }
        resp = self.client.post("/analyze/text", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("analysis", data)
        self.assertIn("confidence", data)
        self.assertIn("signals", data)
        self.assertIn("model_version", data)
        self.assertIn("timestamp", data)
        self.assertTrue(data["is_demo_model"])
        self.assertGreater(data["analysis"]["distress_score"], 40)
        self.assertIn("hopelessness", data["analysis"]["categories_detected"])
        self.assertIn("fear_intimidation", data["analysis"]["categories_detected"])
        self.assertIn("DEMO MODEL", data["disclaimer"])
        self.assertFalse(data["analysis"]["clinical_diagnosis"])
        print("  [PASS] Test 2 Passed: /analyze/text evaluates text markers and returns structured analysis")

    # 3. Voice analysis
    def test_03_analyze_voice(self):
        payload = {
            "has_audio": True,
            "duration_seconds": 12.5,
            "pitch_hz": 210.0,
            "speaking_rate_wpm": 88.0,
            "pause_duration_ratio": 0.42,
            "intensity_variance_db": 18.5,
            "tremor_index": 0.26
        }
        resp = self.client.post("/analyze/voice", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("analysis", data)
        self.assertIn("confidence", data)
        self.assertIn("signals", data)
        self.assertGreater(data["analysis"]["acoustic_distress_score"], 35)
        self.assertIn("pause_duration_ratio", data["analysis"]["features_extracted"])
        self.assertTrue(any("pause" in s.lower() for s in data["signals"]))
        print("  [PASS] Test 3 Passed: /analyze/voice calculates acoustic features with contributing signals")

    # 4. Behavioral analysis
    def test_04_analyze_behavior(self):
        payload = {
            "survivor_id": "usr-victim-001",
            "missed_checkins_count": 3,
            "days_since_last_interaction": 4,
            "declining_engagement": True,
            "sudden_interaction_change": False,
            "rapid_support_requests": 2
        }
        resp = self.client.post("/analyze/behavior", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("analysis", data)
        self.assertEqual(data["analysis"]["engagement_status"], "disengaging")
        self.assertGreaterEqual(data["analysis"]["behavioral_distress_indicator"], 50)
        self.assertTrue(any("missed" in s.lower() for s in data["signals"]))
        print("  [PASS] Test 4 Passed: /analyze/behavior detects engagement attrition and missed pulses")

    # 5. Distress prediction (0-100 & baseline comparison)
    def test_05_predict_distress(self):
        payload = {
            "survivor_id": "usr-victim-001",
            "current_score": 47,
            "baseline_score": 28,
            "upcoming_hearing_days": 6,
            "threat_reported": False
        }
        resp = self.client.post("/predict/distress", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("analysis", data)
        self.assertEqual(data["analysis"]["current_score"], 47)
        self.assertEqual(data["analysis"]["baseline_score"], 28)
        self.assertEqual(data["analysis"]["delta"], 19)
        self.assertEqual(data["analysis"]["risk_category"], "Medium")
        self.assertEqual(data["analysis"]["indicator_name"], "Dynamic Distress Indicator")
        self.assertTrue(any("+19" in s or "elevation" in s.lower() for s in data["signals"]))
        print("  [PASS] Test 5 Passed: /predict/distress computes baseline delta and Dynamic Distress Indicator")

    # 6. Risk prediction (multi-horizon 7, 14, 30 days)
    def test_06_predict_risk(self):
        for window in [7, 14, 30]:
            payload = {
                "survivor_id": "usr-victim-001",
                "prediction_window_days": window,
                "distress_trend": "rising",
                "baseline_deviation": 19,
                "checkin_frequency": "daily",
                "engagement_status": "active",
                "upcoming_hearing_days": 6,
                "threat_reported": True,
                "previous_support_interactions": 2
            }
            resp = self.client.post("/predict/risk", json=payload)
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertIn("analysis", data)
            self.assertEqual(data["analysis"]["prediction_window"], f"{window} days")
            self.assertIn("uncertainty_margin", data["analysis"])
            self.assertIn("plain_language_explanation", data["analysis"])
            self.assertIn("recommended_follow_up", data["analysis"])
            self.assertIn("Elevated distress signal", data["analysis"]["projected_risk_indicator"])
        print("  [PASS] Test 6 Passed: /predict/risk evaluates 7, 14, and 30-day forecast windows with explainability")

    # 7. AI Provider abstraction & Real model adapter substitution
    def test_07_provider_adapter_substitution(self):
        class MockProductionTransformer(RealModelAdapter):
            def run_inference(self, input_data):
                return (
                    {
                        "model_backend": "HuggingFace_PyTorch_Inference_Cluster",
                        "distress_score": 62,
                        "clinical_diagnosis": False,
                    },
                    0.96,
                    ["DeepTransformerLayer9: Elevated somatic anxiety probability (0.96)"]
                )

        # Confirm initial demo mode
        self.assertTrue(text_analyzer.is_demo_model)

        # Substitute adapter
        adapter = MockProductionTransformer()
        text_analyzer.set_real_adapter(adapter)
        self.assertFalse(text_analyzer.is_demo_model)

        # Run inference through replacement interface
        res = self.client.post("/analyze/text", json={"text": "I feel nervous"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["analysis"]["model_backend"], "HuggingFace_PyTorch_Inference_Cluster")
        self.assertEqual(data["confidence"], 0.96)
        self.assertFalse(data["is_demo_model"])

        # Revert back to demo model
        text_analyzer.remove_real_adapter()
        self.assertTrue(text_analyzer.is_demo_model)
        print("  [PASS] Test 7 Passed: AI provider abstraction allows hot-swapping demo model with production ML adapter")

    # 8. Model monitoring hooks
    def test_08_monitoring_metrics(self):
        resp = self.client.get("/monitoring/metrics")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("uptime_seconds", data)
        self.assertIn("active_providers", data)
        self.assertIn("metrics", data)

        # Check recorded model versions in metrics
        metrics = data["metrics"]
        self.assertIn(text_analyzer.model_version, metrics)
        text_metric = metrics[text_analyzer.model_version]
        self.assertGreater(text_metric["total_inferences"], 0)
        self.assertGreater(text_metric["avg_inference_latency_ms"], 0.0)
        self.assertGreater(text_metric["avg_confidence"], 0.0)
        print("  [PASS] Test 8: /monitoring/metrics provides real-time latency, confidence, and error telemetry")


if __name__ == "__main__":
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass

    print("\n================================================================")
    print("AASRA FASTAPI AI SERVICE: PHASE 15 VERIFICATION SUITE")
    print("================================================================\n")
    suite = unittest.TestLoader().loadTestsFromTestCase(TestFastAPIAIService)
    result = unittest.TextTestRunner(verbosity=1).run(suite)
    if not result.wasSuccessful():
        sys.exit(1)
    print("\nAll 8 FastAPI AI Service & Provider Abstraction tests passed successfully!\n")
