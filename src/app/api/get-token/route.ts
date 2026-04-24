import { NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY || "",
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = await client.streaming.createTemporaryToken({ expires_in_seconds: 600 });
    return NextResponse.json({ token });
  } catch (error: any) {
    console.error("Error fetching AssemblyAI token:", error);
    return NextResponse.json(
      { error: "Failed to fetch token", message: error.message },
      { status: 500 }
    );
  }
}
