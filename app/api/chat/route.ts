import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are the AI assistant for Route 9 Web, a local web design business run by Amit in Shrewsbury, Massachusetts. You help potential clients learn about services, pricing, and get questions answered.

About Route 9 Web:
- Owner: Amit — a local developer in Shrewsbury, MA on the Route 9 corridor
- Email: hello@route9web.com | Phone: 508-864-5532
- Service area: Shrewsbury, Westborough, Northborough, Worcester, Framingham, and surrounding Route 9 towns
- Amit can meet you IN PERSON at your shop on Route 9

Services:
- Custom website design and development
- Mobile-first, fast-loading (under 2 seconds), SEO-optimized
- Same-day response for maintenance requests — just text Amit directly
- Ongoing hosting, security, and content updates

Pricing:
STARTER — $750 setup + $40/month
  • 5-page custom site (Home, About, Menu/Services, Contact, Gallery)
  • Mobile-responsive and fast
  • Custom domain setup
  • Google Maps embed
  • Up to 2 content updates/month
  • Hosting, security patches & uptime monitoring
  • Best for: Barbershops, small salons, single-location restaurants

PRO — $1,500 setup + $75/month
  • Everything in Starter
  • Booking integration (Calendly, Vagaro, Booksy, etc.)
  • Custom domain email
  • QR code menu — update without reprinting
  • Social media feeds embedded
  • Up to 4 content updates/month
  • Best for: Established restaurants, cafes, bakeries

CUSTOM — "Let's talk" (no set price)
  • E-commerce & online ordering
  • Square POS integration
  • Multi-location support
  • Best for: Shops with specific or complex requirements

FOUNDING OFFER (limited — first 3 Shrewsbury shops only):
  $300 one-time + $30/month for life on the Starter tier. Just mention this when you reach out.

Process (how it works):
1. Free 20-minute meeting — in person at your shop, or by phone
2. Amit builds a working preview — you see the real site before paying anything
3. You approve → site goes live on your domain (usually same day)
4. Text Amit anytime for updates — no tickets, no hold music

Key guarantees:
- 48-hour average launch time
- Free preview before any payment
- No contracts, no lock-in (30-day notice to cancel)
- You own all files on full payment of setup fee
- If you stop paying, you get all your files

Personality: Be warm, helpful, conversational, and direct. Match the honest, no-nonsense tone of the business. Don't oversell or make up numbers. Keep responses concise — this is a chat widget. If someone asks something you genuinely don't know, suggest they reach out to Amit directly.

When relevant, mention the section of the page they can scroll to: pricing section, portfolio, process ("How It Works"), or contact form.`;

const requests = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 60_000;
  const prev = (requests.get(ip) ?? []).filter((t) => now - t < window);
  if (prev.length >= 12) return true;
  requests.set(ip, [...prev, now]);
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return new Response("Rate limited — please wait a moment.", { status: 429 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "Chat isn't configured yet — reach out directly at hello@route9web.com or call 508-864-5532!",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.messages || !Array.isArray(body.messages)) {
    return new Response("Bad request", { status: 400 });
  }

  const messages: Anthropic.MessageParam[] = (body.messages as unknown[])
    .filter((m): m is { role: string; content: string } => {
      if (typeof m !== "object" || m === null) return false;
      const msg = m as Record<string, unknown>;
      return (
        (msg.role === "user" || msg.role === "assistant") &&
        typeof msg.content === "string"
      );
    })
    .slice(-12)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: String(m.content).slice(0, 2000),
    }));

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return new Response("Bad request", { status: 400 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
