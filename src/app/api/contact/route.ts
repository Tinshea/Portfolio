import { NextResponse } from "next/server";
import user from "@/data/user.json";

// Sends through Resend's REST API (no SDK needed). Requires RESEND_API_KEY.
// Without a verified domain on Resend, leave CONTACT_FROM unset: their
// onboarding sender only delivers to the account owner's own address.
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Contact form not configured" }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { name, email, message, company } = (payload ?? {}) as Record<string, unknown>;

  // `company` is a honeypot: humans never see the field, bots fill it in.
  if (typeof company === "string" && company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    name.length > 200 ||
    typeof email !== "string" ||
    email.length > 320 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof message !== "string" ||
    message.trim().length === 0 ||
    message.length > 5000
  ) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO ?? user.email],
      reply_to: email,
      subject: `[Portfolio] Message de ${name.trim()}`,
      text: `De : ${name.trim()} <${email}>\n\n${message.trim()}`,
    }),
  });

  if (!response.ok) {
    console.error("Resend error:", response.status, await response.text());
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
