import { NextResponse } from "next/server";

const apiUrl = process.env.SERVER_URL

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { mom_code, floor, transcript } = body
    const response = await fetch(`${apiUrl}/mom/transcript`, {
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
    console.log(data)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error posting transcript:", error);
    return NextResponse.json(
      { error: "Failed to post transcript", message: error.message },
      { status: 500 }
    );
  }
}
