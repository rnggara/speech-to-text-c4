import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();

    if (!transcript) {
      return NextResponse.json(
        { success: false, message: "Transcript is required" },
        { status: 400 }
      );
    }

    const lines = transcript.split(/\s+/).filter(Boolean);
    const wordCount = lines.length;

    const bulletPoints: string[] = [];
    const sentences = transcript.match(/[^.!?]+[.!?]+/g) || [transcript];

    // Simple local summarization logic
    const numBullets = Math.min(5, Math.max(3, Math.floor(sentences.length / 2)));

    for (let i = 0; i < Math.min(numBullets, sentences.length); i++) {
      const idx = Math.floor((i * sentences.length) / numBullets);
      const sentence = sentences[idx].trim();
      if (sentence.length > 10) {
        bulletPoints.push(`• ${sentence}`);
      }
    }

    const summary = `Ringkasan (${wordCount} kata):\n\n${bulletPoints.join('\n')}`;

    return NextResponse.json({
      success: true,
      summary: summary,
    });
  } catch (error: any) {
    console.error("Error summarizing transcript locally:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to summarize transcript" },
      { status: 500 }
    );
  }
}