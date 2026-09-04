import { NextResponse } from "next/server";

const apiUrl = process.env.SERVER_URL

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { mom_code, token, floor, transcript } = body
    const response = await fetch(`${apiUrl}/mom/transcript?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mom_code,
        floor,
        transcript,
      }),
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error posting transcript:", error);
    return NextResponse.json(
      { error: "Failed to post transcript", message: error.message },
      { status: 500 }
    );
  }
}
