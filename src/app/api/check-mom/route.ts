import { NextResponse } from "next/server";

const apiUrl = process.env.SERVER_URL

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { mom_code, token } = body
    const response = await fetch(`${apiUrl}/mom/check?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mom_code,
      }),
    })
    const data = await response.json()
    console.log(data)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error checking mom code:", error);
    return NextResponse.json(
      { error: "Failed to check mom code", message: error.message },
      { status: 500 }
    );
  }
}
