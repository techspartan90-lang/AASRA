/**
 * MANAS SURAKSHA — Verified Centralized Helplines Directory
 *
 * Official Directory of verified emergency response, victim support,
 * and mental-health crisis helplines across India.
 *
 * Authoritative Standards:
 * - 112: Emergency Response Support System (ERSS) — Ministry of Home Affairs (MHA)
 * - 14566: National Helpline Against Atrocities (NHAA) — Ministry of Social Justice & Empowerment (MoSJE)
 * - 14416 / 1800-891-4416: Tele-MANAS — Ministry of Health & Family Welfare (MoHFW) / NIMHANS
 * - 181: Women Helpline (WHL) — Ministry of Women and Child Development (MWCD)
 * - 1098: Childline (Integrated with 112) — Ministry of Women and Child Development (MWCD)
 * - 1800-599-0019: KIRAN Mental Health Rehabilitation Helpline — DEPwD, MoSJE
 * - 15100: Legal Services Authority (NALSA / DLSA) — Free Legal Aid under SC/ST PoA Act
 */

export interface VerifiedHelpline {
  id: string;
  serviceName: string;
  nativeServiceName?: string;
  verifiedPhoneNumber: string;
  alternateNumber?: string;
  telUri: string;
  purpose: 'emergency' | 'atrocity_victim_support' | 'mental_health' | 'women_safety' | 'child_protection' | 'legal_aid';
  categoryLabel: string;
  serviceDescription: string;
  availability: string;
  tollFree: boolean;
  sourceOfVerification: string;
  verificationSourceUrl: string;
  lastVerificationDate: string; // ISO Date YYYY-MM-DD
  isOfficialGovService: boolean;
  desktopInstructions: string;
  priorityOrder: number;
}

export const VERIFIED_HELPLINES: VerifiedHelpline[] = [
  {
    id: 'erss-112',
    serviceName: 'National Emergency Response Support System (ERSS)',
    nativeServiceName: 'राष्ट्रीय आपातकालीन प्रतिक्रिया सहायता प्रणाली',
    verifiedPhoneNumber: '112',
    telUri: 'tel:112',
    purpose: 'emergency',
    categoryLabel: 'Immediate Emergency Response',
    serviceDescription:
      'Single pan-India emergency number for immediate Police, Medical Emergency (Ambulance), and Fire brigade response. Available from any mobile phone or landline even without a SIM balance.',
    availability: '24/7/365 (Immediate Dispatch)',
    tollFree: true,
    sourceOfVerification: 'Ministry of Home Affairs (MHA), Government of India (112.gov.in)',
    verificationSourceUrl: 'https://112.gov.in',
    lastVerificationDate: '2026-10-01',
    isOfficialGovService: true,
    desktopInstructions: 'From any phone in India, dial 112 directly. If on desktop, keep your phone handy and dial 112 for immediate police or ambulance assistance.',
    priorityOrder: 1,
  },
  {
    id: 'nhaa-14566',
    serviceName: 'National Helpline Against Atrocities (NHAA)',
    nativeServiceName: 'अत्याचार के विरुद्ध राष्ट्रीय हेल्पलाइन',
    verifiedPhoneNumber: '14566',
    telUri: 'tel:14566',
    purpose: 'atrocity_victim_support',
    categoryLabel: 'Atrocity Victim Support & SC/ST Rights',
    serviceDescription:
      'Official statutory 24x7 toll-free helpline launched under the SC/ST (Prevention of Atrocities) Act, 1989. Facilitates immediate docketing of atrocity grievances, ensures FIR registration oversight, legal aid access, and tracking of statutory victim relief grants.',
    availability: '24 hours a day, 7 days a week (Toll-Free)',
    tollFree: true,
    sourceOfVerification: 'Ministry of Social Justice and Empowerment (MoSJE), Government of India',
    verificationSourceUrl: 'https://socialjustice.gov.in',
    lastVerificationDate: '2026-10-01',
    isOfficialGovService: true,
    desktopInstructions: 'Dial 14566 from any phone or mobile device. Operators assist in Hindi, English, and regional languages with case docketing and relief tracking.',
    priorityOrder: 2,
  },
  {
    id: 'telemanas-14416',
    serviceName: 'Tele-MANAS Mental Health Assistance Helpline',
    nativeServiceName: 'टेली-मानस मानसिक स्वास्थ्य हेल्पलाइन',
    verifiedPhoneNumber: '14416',
    alternateNumber: '1800-891-4416',
    telUri: 'tel:14416',
    purpose: 'mental_health',
    categoryLabel: '24/7 Psychological Crisis & Distress Counselling',
    serviceDescription:
      'National tele-mental health programme providing free, confidential counseling, psychological first-aid, and crisis support in 20+ Indian regional languages by certified clinical psychologists and counsellors.',
    availability: '24/7/365 (Toll-Free Pan-India)',
    tollFree: true,
    sourceOfVerification: 'Ministry of Health and Family Welfare (MoHFW), Government of India / NIMHANS',
    verificationSourceUrl: 'https://telemanas.mohfw.gov.in',
    lastVerificationDate: '2026-10-01',
    isOfficialGovService: true,
    desktopInstructions: 'Dial toll-free shortcode 14416 or 1800-891-4416 from any telephone in India. Choose your preferred language when prompted.',
    priorityOrder: 3,
  },
  {
    id: 'whl-181',
    serviceName: 'Women Helpline (WHL)',
    nativeServiceName: 'महिला हेल्पलाइन',
    verifiedPhoneNumber: '181',
    telUri: 'tel:181',
    purpose: 'women_safety',
    categoryLabel: 'Women in Distress & Crisis Rescue',
    serviceDescription:
      '24-hour toll-free telephonic service providing integrated support and assistance to women affected by violence, harassment, or distress, with direct linkage to One Stop Centres (OSC), police, and medical aid.',
    availability: '24/7 (Toll-Free Pan-India)',
    tollFree: true,
    sourceOfVerification: 'Ministry of Women and Child Development (MWCD), Government of India',
    verificationSourceUrl: 'https://wcd.nic.in',
    lastVerificationDate: '2026-10-01',
    isOfficialGovService: true,
    desktopInstructions: 'Dial 181 from any mobile phone or landline in India for emergency assistance and legal/counselling support for women.',
    priorityOrder: 4,
  },
  {
    id: 'childline-1098',
    serviceName: 'Childline Emergency Care Helpline',
    nativeServiceName: 'चाइल्डलाइन आपातकालीन सेवा',
    verifiedPhoneNumber: '1098',
    telUri: 'tel:1098',
    purpose: 'child_protection',
    categoryLabel: 'Emergency Child Rescue & Protection',
    serviceDescription:
      '24/7 emergency toll-free phone outreach service for children in need of care, safety, and protection, integrated with the national Emergency Response Support System (112).',
    availability: '24/7/365 (Toll-Free)',
    tollFree: true,
    sourceOfVerification: 'Ministry of Women and Child Development (MWCD), Government of India',
    verificationSourceUrl: 'https://wcd.nic.in',
    lastVerificationDate: '2026-10-01',
    isOfficialGovService: true,
    desktopInstructions: 'Dial 1098 from any phone to report an emergency involving a minor or request child protection assistance.',
    priorityOrder: 5,
  },
  {
    id: 'kiran-18005990019',
    serviceName: 'KIRAN Mental Health Rehabilitation Helpline',
    nativeServiceName: 'किरण मानसिक स्वास्थ्य पुनर्वास हेल्पलाइन',
    verifiedPhoneNumber: '1800-599-0019',
    telUri: 'tel:18005990019',
    purpose: 'mental_health',
    categoryLabel: 'Rehabilitation & Distress Alleviation',
    serviceDescription:
      'Toll-free mental health helpline operated by the Department of Empowerment of Persons with Disabilities to provide psychological support, stress management, and mental health rehabilitation in 13 languages.',
    availability: '24/7 Toll-Free',
    tollFree: true,
    sourceOfVerification: 'DEPwD, Ministry of Social Justice and Empowerment, Government of India',
    verificationSourceUrl: 'https://disabilityaffairs.gov.in',
    lastVerificationDate: '2026-10-01',
    isOfficialGovService: true,
    desktopInstructions: 'Call toll-free 1800-599-0019 from any phone for psychological first-aid and mental rehabilitation support.',
    priorityOrder: 6,
  },
  {
    id: 'nalsa-15100',
    serviceName: 'National Legal Services Authority (NALSA / DLSA)',
    nativeServiceName: 'राष्ट्रीय विधिक सेवा प्राधिकरण',
    verifiedPhoneNumber: '15100',
    telUri: 'tel:15100',
    purpose: 'legal_aid',
    categoryLabel: 'Statutory Free Legal Aid & Victim Compensation',
    serviceDescription:
      'National legal aid helpline providing free legal counsel, legal representation, and assistance with witness protection grants and victim compensation claims under Section 15A of the SC/ST PoA Act.',
    availability: 'Working Hours (9:30 AM – 6:00 PM, Mon–Sat)',
    tollFree: true,
    sourceOfVerification: 'National Legal Services Authority (NALSA / nalsa.gov.in)',
    verificationSourceUrl: 'https://nalsa.gov.in',
    lastVerificationDate: '2026-10-01',
    isOfficialGovService: true,
    desktopInstructions: 'Dial 15100 during working hours to speak with a legal aid counsel regarding court hearings, witness protection, or compensation grants.',
    priorityOrder: 7,
  },
];

/**
 * Returns the primary national emergency response helpline (112)
 */
export function getEmergencyHelpline(): VerifiedHelpline {
  return VERIFIED_HELPLINES.find(h => h.id === 'erss-112')!;
}

/**
 * Returns the primary atrocity survivor support helpline (14566)
 */
export function getAtrocityVictimHelpline(): VerifiedHelpline {
  return VERIFIED_HELPLINES.find(h => h.id === 'nhaa-14566')!;
}

/**
 * Returns the primary mental-health counseling helpline (14416 / Tele-MANAS)
 */
export function getMentalHealthHelpline(): VerifiedHelpline {
  return VERIFIED_HELPLINES.find(h => h.id === 'telemanas-14416')!;
}

/**
 * Returns a specific helpline by ID
 */
export function getHelplineById(id: string): VerifiedHelpline | undefined {
  return VERIFIED_HELPLINES.find(h => h.id === id);
}

/**
 * Standard disclaimer regarding Quick Exit vs Emergency Services
 */
export const QUICK_EXIT_SAFETY_NOTICE =
  'Quick Exit is a privacy feature designed to discreetly close this screen immediately if an abuser approaches. Quick Exit does NOT dial emergency services or request police/medical dispatch. In an emergency, always dial 112.';

export const QUICK_EXIT_DISCLAIMER = QUICK_EXIT_SAFETY_NOTICE;
export const OFFICIAL_HELPLINES = VERIFIED_HELPLINES;
export const getAtrocityHelpline = getAtrocityVictimHelpline;
