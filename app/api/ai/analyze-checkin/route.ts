import { NextRequest, NextResponse } from 'next/server';
import { calculateDistressAnalysis, AnalysisInput } from '@/lib/ai-service';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body: AnalysisInput = await req.json();

    // Baseline deterministic analysis
    const baselineResult = calculateDistressAnalysis(body);

    // If GEMINI_API_KEY is available and text/notes are provided, enhance qualitative insights
    if (process.env.GEMINI_API_KEY && (body.notes || body.hasVoiceSample)) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemInstruction = `You are a specialized AI assistant integrated into a government victim welfare and distress early-warning system.
CRITICAL ETHICAL RULES:
1. You must NEVER claim to diagnose a mental health disorder (no "depression", "PTSD", "bipolar", or "mentally unstable").
2. Only use phrases like: "Elevated distress indicators detected", "Requires human assessment", "Risk indicators increased", "Follow-up recommended".
3. Your purpose is strictly early-warning screening to assist authorized human counsellors and officials.
4. Output must be strictly valid JSON matching this schema:
{
  "qualitativeSummary": "string",
  "detectedSignals": ["string"],
  "recommendedAction": "string"
}`;

        const prompt = `Analyze this victim check-in note with trauma sensitivity:
User Note: "${body.notes || 'Audio check-in completed'}"
Quantitative Scores: Feeling ${body.feelingScore}/5, Safety ${body.safetyScore}/5, Sleep ${body.sleepScore}/5, Fear ${body.fearScore}/5, Avoidance ${body.avoidanceScore}/5.
Generate concise, non-stigmatizing screening observations for the assigned caseworker.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed.detectedSignals && Array.isArray(parsed.detectedSignals)) {
            // Merge signals without duplicates
            const merged = Array.from(new Set([...baselineResult.contributingSignals, ...parsed.detectedSignals]));
            baselineResult.contributingSignals = merged;
          }
          if (parsed.qualitativeSummary) {
            baselineResult.explanationSummary = parsed.qualitativeSummary;
          }
          if (parsed.recommendedAction) {
            baselineResult.recommendedNextStep = parsed.recommendedAction;
          }
        }
      } catch (geminiError) {
        console.warn('Gemini qualitative enhancement skipped, using deterministic analysis:', geminiError);
      }
    }

    return NextResponse.json(baselineResult);
  } catch (error) {
    console.error('Error in analyze-checkin:', error);
    return NextResponse.json(
      { error: 'Failed to process well-being analysis' },
      { status: 500 }
    );
  }
}
