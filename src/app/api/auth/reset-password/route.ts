import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (!process.env.API) {
      console.error("API environment variable is not set");
      return NextResponse.json(
        { message: "Server configuration error. Please contact support." },
        { status:500  }
      );
    }

    const body = await req.json();

    const res = await fetch(`${process.env.API}/auth/resetPassword`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Check if response is JSON
    // const contentType = res.headers.get("content-type");
    // if (!contentType || !contentType.includes("application/json")) {
    //   const text = await res.text();
    //   console.error("Non-JSON response from backend:", text);
    //   return NextResponse.json(
    //     { message: "Invalid response from server. Please try again." },
    //     { status:res.status }
    //   );
    // }

    const payload = await res.json();
    if (!res.ok) {
      const message = payload?.message || "Failed to reset password";
      return NextResponse.json({ message }, { status: res.status });
    }

    return NextResponse.json(payload, { status: res.status });
  } catch (e: any) {
    console.error("Reset password error:", e);
    return NextResponse.json(
      { message: e?.message || "Unexpected error occurred. Please try again." },
      { status: e.status }
    );
  }
}

