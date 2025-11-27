// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.API}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = await res.json();
    if (!res.ok) {
      // normalize error shape
      const message = payload?.message || "Registration failed";
      return NextResponse.json({ message }, { status: res.status });
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Unexpected error" }, { status: 500 });
  }
}