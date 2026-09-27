# Data Governance & Compliance Framework

## 1. Statutory Alignments
The AASRA Care platform architecture adheres to:
* **The Digital Personal Data Protection Act (DPDPA), 2023**: Purpose limitation, notice, explicit consent, withdrawal mechanisms, and verifiable data fiduciary obligations.
* **Mental Healthcare Act (MHCA), 2017**: Strict confidentiality of mental health records and respect for patient autonomy.
* **The Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989 & Rules**: Mandated victim protection, relief coordination, and socio-legal rehabilitation support.

## 2. Subject Rights & Access Control
* **Right to Information**: Victims have direct access to their active case timeline, historical check-ins, baseline scores, and scheduled support sessions.
* **Right to Consent Withdrawal**: Victims may disable automated reminders, voice analytics, or AI processing at any time via the Privacy Center.
* **Right to Eradication**: Case data may be purged following the expiration of the statutory 365-day monitoring schedule, provided no active judicial hold exists.

## 3. Data Flow & Boundary Isolation
```
[ Victim Check-In ]
         │
         ▼
[ In-Memory Acoustic Extraction ] ───▶ [ Raw Audio Discarded (0-Day Retention) ]
         │
         ▼
[ Feature Vector Sanitization ]
         │
         ▼
[ Rule Engine + ML Model ]
         │
         ▼
[ Explainable Prediction ] ──────────▶ [ Human Caseworker Review ]
         │                                       │
         ▼                                       ▼
[ Database Persistence (RLS) ]           [ Support Intervention ]
```
