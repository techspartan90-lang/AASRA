# AI Limitations & Responsible Governance Notice

## 1. Non-Diagnostic Principle
The AASRA Care platform **does not**:
* Diagnose Post-Traumatic Stress Disorder (PTSD), Clinical Depression, or Anxiety Disorders.
* Prescribe or suggest pharmaceutical medications or dosages.
* Autonomously categorize victims as medically unstable.
* Autonomously trigger law enforcement, arrests, or involuntary psychiatric holds.
* Make determinations regarding legal compensation, witness protection eligibility, or state relocation.

## 2. Decision-Support Boundaries
All numerical indicators ([0, 100]), risk levels (`low`, `medium`, `high`, `critical`), and trajectory labels (`Improving`, `Stable`, `Increasing`, `Rapidly increasing`, `Fluctuating`) serve exclusively as decision-support heuristics to assist authorized human professionals.

## 3. Algorithmic Uncertainty & Insufficient Data
* Predictions generated with fewer than 2 previous historical check-ins are explicitly flagged with `Uncertainty: Insufficient data` and a confidence cap.
* The system never fabricates historical baselines when past data is absent.
* Model probabilities reflect empirical historical escalation frequencies within prototype datasets, not clinical prognostic certainty.

## 4. Multilingual & Cultural Considerations
While 10 Indian languages are supported (Hindi, Bengali, Assamese, Khasi, Mizo, Manipuri, Bodo, Nepali, Tamil, and English), linguistic nuances, regional idioms, and dialectal variations can affect automated keyword extraction. Human caseworkers fluent in the victim's primary tongue must review flagged submissions.
