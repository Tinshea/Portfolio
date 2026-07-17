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
  const { name, email, message, company, locale } = (payload ?? {}) as Record<string, unknown>;

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

  // Confirmation to the visitor — only with a verified domain (CONTACT_FROM),
  // since the test sender cannot deliver to strangers. Deliberately generic:
  // echoing submitted content would let spammers relay text through our
  // domain. Its failure never fails the request; the owner got the message.
  const from = process.env.CONTACT_FROM;
  if (from) {
    const isEn = locale === "en";
    const confirmation = isEn
      ? {
          subject: "Your message has been received",
          text: `Hello,\n\nYour message was delivered — I will get back to you quickly.\n\nMalek Bouzarkouna\nhttps://www.malekbouzarkouna.com`,
        }
      : {
          subject: "Votre message a bien été reçu",
          text: `Bonjour,\n\nVotre message m'est bien parvenu — je vous répondrai rapidement.\n\nMalek Bouzarkouna\nhttps://www.malekbouzarkouna.com`,
        };
    try {
      const confirmResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [email],
          reply_to: process.env.CONTACT_TO ?? user.email,
          subject: confirmation.subject,
          text: confirmation.text,
        }),
      });
      if (!confirmResponse.ok) {
        console.error("Resend confirmation error:", confirmResponse.status, await confirmResponse.text());
      }
    } catch (error) {
      console.error("Resend confirmation error:", error);
    }
  }

  return NextResponse.json({ ok: true });
}
