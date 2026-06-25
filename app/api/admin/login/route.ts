import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const validEmail = process.env.ADMIN_EMAIL;
    const validPass = process.env.ADMIN_PASSWORD;
    const sessionToken = process.env.ADMIN_SESSION_TOKEN;

    if (!validEmail || !validPass || !sessionToken) {
      console.error("Missing ADMIN_EMAIL, ADMIN_PASSWORD, or ADMIN_SESSION_TOKEN env vars");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    if (email === validEmail && password === validPass) {
      const response = NextResponse.json({ success: true });

      response.cookies.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
