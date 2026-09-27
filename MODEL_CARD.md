# Model Card: AASRA Care Longitudinal Distress Trajectory Predictor

## Model Details
* **Model Name**: Interpretable Longitudinal Risk Predictor Suite
* **Architectures Supported**:
  1. *Logistic Risk Model* (`logistic-v1.2-prototype`): Interpretable linear additive logit model with calibrated feature weights.
  2. *Random Forest Decision Ensemble* (`rf-ensemble-v2.0-prototype`): Multi-tree interaction model capturing nonlinear acute spikes.
  3. *Gradient Boosted Decision Trees* (`gbdt-v1.4-prototype`): Boosted residual decision trees.
* **Feature Version**: `features-v1`
* **Release Date**: September 2026

## Intended Use
* **Primary Task**: Estimate the trajectory of self-reported distress indicators over a future 7–14 day monitoring window.
* **Intended Users**: Authorized clinical counsellors, district welfare officers, and judicial case managers.
* **Target Population**: Victims of socio-legal atrocities undergoing monitored rehabilitation and court assistance.

## Out-of-Scope & Prohibited Uses
* Autonomous triage or emergency dispatch without caseworker verification.
* Forensic determination of victim credibility or legal guilt/innocence.
* Replacement for comprehensive psychiatric or psychological evaluations.

## Factors & Inputs
* **Self-Reported Distress**: Acute fear (1–5), sleep disruption (1–5), emotional stress (1–5), withdrawal (1–5), safety concern (1–5).
* **Longitudinal Dynamics**: Personal baseline deviation, 7d/30d/90d rolling means, trajectory slope, momentum, consecutive increases.
* **Service Telemetry**: Missed check-in frequency, intervention recency, active alert history.
* **Multimodal Features (Supplementary)**: Voluntary voice pause rate, pitch variance jitter, multilingual negative sentiment ratio.

## Performance & Fairness Metrics (Synthetic Validation Benchmark)
* **Accuracy**: 0.90 – 0.92
* **Precision**: 0.89 – 0.91
* **Recall**: 0.91 – 0.93
* **ROC-AUC**: 0.88 – 0.94
* **Brier Score**: 0.09 – 0.15 (Calibrated probability score)
* **Fairness Disparity Ratio**: Subgroup fairness audits across gender, caste categories, rural/urban settings, and linguistic minorities demonstrate disparity ratios between 0.96 and 1.04 (within equitable parity thresholds).
* **Validation Status**: Prototype evaluation conducted on synthetic demonstration datasets only. Clinical efficacy trials not yet performed.
