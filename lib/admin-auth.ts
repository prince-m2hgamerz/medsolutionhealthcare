import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function checkAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  const validToken = process.env.ADMIN_SESSION_TOKEN;
  if (!validToken || session !== validToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
