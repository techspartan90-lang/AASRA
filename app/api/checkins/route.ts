import { NextRequest, NextResponse } from 'next/server';
import { repositories } from '@/lib/repositories';
import { aiService } from '@/lib/services/ai-service-provider';
import { calculatePersonalBaseline } from '@/lib/engines/longitudinal-engine';
import { checkRateLimit, getClientIdentifier } from '@/lib/security/rate-limiter';
import { sanitizeInputForAi } from '@/lib/security/prompt-guard';
import { sanitizeApiError, logSecurityEvent } from '@/lib/security/auth-middleware';

export async function POST(req: NextRequest) {
  const requestId = `chk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const clientId = getClientIdentifier(req);

  // 1. Rate Limiting Check
  const rateLimit = checkRateLimit(clientId, 'checkin_submission');
  if (!rateLimit.allowed) {
    logSecurityEvent({
      action: 'RATE_LIMIT_EXCEEDED',
      actorId: clientId,
      actorRole: 'anonymous',
      resourceType: 'checkins',
      result: 'DENY',
      reason: 'Checkin rate limit exceeded',
      requestId,
    });

    return NextResponse.json(
      {
        error: 'Too many check-in submissions. Please wait before submitting another entry.',
        code: 'RATE_LIMIT_EXCEEDED',
        requestId,
        resetMs: rateLimit.resetMs,
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil(rateLimit.resetMs / 1000).toString(),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const caseId = body.caseId || 'CASE-002';
    const userId = body.userId || 'usr-victim-001';

    // 2. Input Sanitization & Safety-Critical Signal Extraction
    const rawNotes = typeof body.notes === 'string' ? body.notes : '';
    const sanitization = sanitizeInputForAi(rawNotes);
    const cleanedNotes = sanitization.sanitizedText;
    const explicitSafetyConcern =
      sanitization.hasExplicitSafetyConcern ||
      Boolean(body.explicitSafetyConcern) ||
      (Number(body.safetyScore) >= 5);

    if (sanitization.hasSuspectedInjection) {
      logSecurityEvent({
        action: 'PROMPT_INJECTION_NEUTRALIZED',
        actorId: userId,
        actorRole: 'victim',
        resourceType: 'checkins',
        result: 'FLAG',
        reason: `Adversarial pattern neutralized in check-in notes: ${sanitization.detectedPatterns.join(', ')}`,
        requestId,
      });
    }

    // 3. Fetch historical check-ins to compute longitudinal baseline
    const previousCheckIns = await repositories.checkIns.getByCaseId(caseId);
    const previousAssessments = await repositories.assessments.getByCaseId(caseId);

    const historicalScores = previousAssessments.map(a => a.indicator);
    const baseline = calculatePersonalBaseline(historicalScores);

    // 4. Run feature extraction and AI analysis with deterministic fallback
    const analysis = await aiService.analyzeCheckIn({
      feelingScore: body.feelingScore ?? 3,
      safetyScore: body.safetyScore ?? 3,
      sleepScore: body.sleepScore ?? 3,
      fearScore: body.fearScore ?? 1,
      avoidanceScore: body.avoidanceScore ?? 1,
      requestHelp: Boolean(body.requestHelp) || explicitSafetyConcern,
      notes: cleanedNotes,
      hasVoiceSample: Boolean(body.hasVoiceSample),
      historicalScores: historicalScores.length > 0 ? historicalScores : [baseline],
      previousScore: historicalScores.length > 0 ? historicalScores[historicalScores.length - 1] : baseline,
    });

    // If explicit safety concern detected, elevate assessment flags safely without automated medical diagnosis
    const finalLevel = explicitSafetyConcern && analysis.level !== 'high' ? 'high' : analysis.level;
    const contributingFactors = [...analysis.contributingFactors];
    if (explicitSafetyConcern && !contributingFactors.includes('User-reported safety concern')) {
      contributingFactors.unshift('User-reported safety concern requires prompt human review');
    }

    // 5. Persist CheckIn
    const checkInRecord = await repositories.checkIns.create({
      caseId,
      timestamp: new Date().toISOString(),
      feeling: body.feelingScore ?? 3,
      safetyConcern: body.safetyScore ?? 3,
      sleep: body.sleepScore ?? 3,
      fear: body.fearScore ?? 1,
      withdrawal: body.avoidanceScore ?? 1,
      professionalSupport: Boolean(body.requestHelp) || explicitSafetyConcern,
      textResponse: cleanedNotes,
      voiceResponse: Boolean(body.hasVoiceSample),
      completionStatus: 'completed',
    });

    // 6. Persist Distress Assessment
    const assessment = await repositories.assessments.create({
      checkInId: checkInRecord.id,
      caseId,
      indicator: analysis.indicator,
      level: finalLevel,
      baseline: analysis.baseline,
      baselineDeviation: analysis.baselineDeviation,
      trend: analysis.trend,
      confidence: analysis.confidence,
      contributingFactors,
    });

    // 7. Trigger alert if distress is elevated/high, help requested, or safety concern flagged
    let createdAlert = null;
    const shouldAlert = finalLevel === 'high' || finalLevel === 'elevated' || body.requestHelp || explicitSafetyConcern;

    if (shouldAlert) {
      let alertReason = `Significant deviation from baseline (+${analysis.baselineDeviation} pts): ${analysis.trend} trajectory`;
      if (explicitSafetyConcern) {
        alertReason = 'User-reported safety concern requires human review according to the configured support protocol.';
      } else if (body.requestHelp) {
        alertReason = 'Victim explicitly requested counsellor callback + elevated distress pattern.';
      }

      createdAlert = await repositories.alerts.create({
        caseId,
        severity: finalLevel,
        reason: alertReason,
        status: finalLevel === 'high' || explicitSafetyConcern ? 'urgent' : 'pending',
        assignedTo: 'Dr. Priya Nair',
        recommendedAction: explicitSafetyConcern
          ? 'Initiate prompt human welfare check according to safety protocol (human review required).'
          : analysis.recommendedHumanAction || 'Caseworker review recommended.',
      });

      // Notify counsellor
      await repositories.notifications.create({
        userId: 'usr-counsellor-002',
        type: 'alert',
        title: explicitSafetyConcern ? `URGENT Safety Review: Case ${caseId}` : `Distress Alert: Case ${caseId}`,
        message: alertReason,
      });
    }

    // 8. Audit Logging (Zero sensitive PII in audit metadata)
    await repositories.audit.create({
      userId,
      action: 'SUBMIT_CHECKIN',
      resource: 'check_ins',
      resourceId: checkInRecord.id,
      metadata: {
        caseId,
        score: analysis.indicator,
        baseline: analysis.baseline,
        level: finalLevel,
        isAiFallback: analysis.isAiFallback,
        explicitSafetyConcern,
        alertGenerated: Boolean(createdAlert),
        requestId,
      },
    });

    return NextResponse.json(
      {
        checkIn: checkInRecord,
        assessment,
        alert: createdAlert,
        analysis: {
          ...analysis,
          level: finalLevel,
          contributingFactors,
        },
        explicitSafetyConcern,
        message: 'Check-in recorded, baseline updated, and distress assessment persisted successfully.',
      },
      {
        status: 200,
        headers: {
          'x-request-id': requestId,
        },
      }
    );
  } catch (error) {
    const sanitized = sanitizeApiError(error, requestId);
    console.error(`[API_ERROR] CheckIn POST failed (req: ${requestId}):`, error);
    return NextResponse.json(sanitized, { status: sanitized.statusCode });
  }
}
