import { NextRequest, NextResponse } from 'next/server';
import { detectLanguage, extractMultilingualEmotion } from '@/lib/ai/multilingual-nlp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text = '', preferredLanguage = 'en' } = body;

    const detection = detectLanguage(text, preferredLanguage);
    const emotionSignal = extractMultilingualEmotion(text, detection.detectedLanguage);

    return NextResponse.json({
      detection,
      emotionSignal,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process multilingual text' }, { status: 500 });
  }
}
