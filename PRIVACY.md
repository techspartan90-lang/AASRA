# Privacy & Data Protection Policy

## 1. Data Minimization
* **Zero Permanent Voice Storage**: Raw audio waveforms and recordings are processed in-memory for acoustic metrics (speech rate, pitch variance, jitter) and immediately discarded. No raw audio files are stored in the database.
* **Coarse Location Aggregation**: The platform captures only District and State welfare jurisdictions. Precise GPS coordinates, IP geolocations, and street addresses are prohibited.
* **Audit Trail Minimization**: Audit logs store only actor IDs, timestamps, resource types, and action codes. Free-form text and sensitive victim narratives are omitted from audit log metadata.

## 2. Retention Schedules
* **Active Check-in Records**: Retained for 365 days of longitudinal monitoring, then archived.
* **Raw Audio Waves**: 0 days (instant purge post-feature extraction).
* **Audit Trail**: 730 days (2 years statutory requirement for legal accountability).
* **AI Telemetry & Calibration**: 180 days (anonymized metadata only).

## 3. Informed Consent & Sovereignty
* Users may grant or withdraw consent at any time in the Privacy Center for voice analysis, automated reminders, and longitudinal distress aggregation.
* Withdrawing consent automatically routes the user to text-based and non-AI workflows without impacting case allocation or emergency support access.
