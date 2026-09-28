"""
AI Provider Abstraction for AASRA Platform (Phase 15)

Defines:
- BaseAnalyzer: Abstract class establishing the plug-and-play contract
- RealModelAdapter: Interface for swapping mock demo inference with real PyTorch/ONNX/HuggingFace/Gemini models
- Deterministic mock inference with explicit DEMO MODEL tagging
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Tuple, Callable
import time
from ..monitoring import monitor


class RealModelAdapter(ABC):
    """
    Contract for real production machine learning models (HuggingFace Transformers,
    PyTorch, ONNX Runtime, or Vertex AI / Gemini endpoints).
    """

    @abstractmethod
    def run_inference(self, input_data: Dict[str, Any]) -> Tuple[Dict[str, Any], float, List[str]]:
        """
        Executes real deep-learning / LLM inference.
        Returns: (analysis_dict, confidence_score, contributing_signals_list)
        """
        pass


class BaseAnalyzer(ABC):
    """
    Base abstract class for all AASRA AI service analyzers and predictors.
    """

    def __init__(self, model_name: str, model_version: str):
        self.model_name = model_name
        self.model_version = model_version
        self.is_demo_model = True
        self._real_adapter: Optional[RealModelAdapter] = None

    def set_real_adapter(self, adapter: RealModelAdapter):
        """
        Replaces deterministic demo inference with a real production ML model adapter.
        """
        self._real_adapter = adapter
        self.is_demo_model = False

    def remove_real_adapter(self):
        """Reverts to deterministic demo inference."""
        self._real_adapter = None
        self.is_demo_model = True

    def analyze(self, input_data: Dict[str, Any]) -> Tuple[Dict[str, Any], float, List[str]]:
        """
        Unified inference runner with automatic model monitoring (latency, confidence, errors).
        """
        start_time = time.perf_counter()
        try:
            if self._real_adapter is not None:
                analysis, confidence, signals = self._real_adapter.run_inference(input_data)
            else:
                analysis, confidence, signals = self._deterministic_demo_inference(input_data)

            latency_ms = (time.perf_counter() - start_time) * 1000.0
            monitor.record_inference(self.model_version, latency_ms, confidence)
            return analysis, confidence, signals

        except Exception as e:
            monitor.record_error(self.model_version, str(e))
            raise e

    @abstractmethod
    def _deterministic_demo_inference(self, input_data: Dict[str, Any]) -> Tuple[Dict[str, Any], float, List[str]]:
        """
        Deterministic, transparent heuristic inference used for prototyping,
        development, and offline evaluation.
        """
        pass
