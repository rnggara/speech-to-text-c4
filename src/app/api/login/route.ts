import { NextResponse } from "next/server";

const apiUrl = process.env.SERVER_URL

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, password } = body
    const response = await fetch(`${apiUrl}/login-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
    const data = await response.json()
    console.log(data)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { error: "Failed to login", message: error.message },
      { status: 500 }
    );
  }
}
