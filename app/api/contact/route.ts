import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// In-memory IP rate limiting: max 3 submissions per minute per IP
const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const prev = (submissions.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (prev.length >= 3) return true;
  submissions.set(ip, [...prev, now]);
  return false;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  // Honeypot — bots fill this, humans don't
  if (body.website) return NextResponse.json({ ok: true });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute before trying again." },
      { status: 429 }
    );
  }

  const name    = String(body.name    ?? "").trim();
  const shop    = String(body.shop    ?? "").trim();
  const email   = String(body.email   ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 422 });
  }

  if (name.length > 120 || email.length > 254 || shop.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Input too long." }, { status: 422 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 422 });
  }

  const safeName    = escapeHtml(name);
  const safeShop    = escapeHtml(shop);
  const safeEmail   = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  // Strip CR/LF/tab from subject-line fields to prevent header injection
  const subjectName = name.replace(/[\r\n\t]/g, " ");
  const subjectShop = shop.replace(/[\r\n\t]/g, " ");
  const subject = `Route 9 Web inquiry from ${subjectName}${subjectShop ? ` — ${subjectShop}` : ""}`;

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fefbf5; border-radius: 12px;">
      <h2 style="color: #110B07; font-size: 24px; margin-bottom: 24px;">New contact from Route 9 Web</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #7a6b5c; font-size: 13px; width: 100px;">Name</td><td style="padding: 8px 0; color: #110B07; font-weight: 600;">${safeName}</td></tr>
        ${safeShop ? `<tr><td style="padding: 8px 0; color: #7a6b5c; font-size: 13px;">Shop</td><td style="padding: 8px 0; color: #110B07; font-weight: 600;">${safeShop}</td></tr>` : ""}
        <tr><td style="padding: 8px 0; color: #7a6b5c; font-size: 13px;">Email</td><td style="padding: 8px 0; color: #D4682A;">${safeEmail}</td></tr>
      </table>
      ${safeMessage ? `<div style="margin-top: 24px; padding: 20px; background: #fff; border-left: 3px solid #D4682A; border-radius: 4px;"><p style="color: #110B07; line-height: 1.7; margin: 0;">${safeMessage}</p></div>` : ""}
      <p style="margin-top: 24px; font-size: 12px; color: #9B8C7D;">Sent via route9web.com contact form</p>
    </div>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Route 9 Web <hello@route9web.com>",
    to: "hello@route9web.com",
    replyTo: email,
    subject,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please email us directly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
