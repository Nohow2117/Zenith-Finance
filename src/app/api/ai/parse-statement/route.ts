import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE_NAME, OPENROUTER_TIMEOUT_MS } from "@/lib/constants";
import { verifySessionToken } from "@/lib/auth/session";

const SYSTEM_PROMPT = `Sei un parser finanziario. Estrai SOLAMENTE prelievi ATM (cash withdrawals) e pagamenti con carta (card payments/POS) da questo testo. Ignora bonifici in ingresso, stipendi o altre entrate. Restituisci solo un array JSON con oggetti nel formato: [{"date":"YYYY-MM-DD","description":"...","amountEur":0.00,"type":"expense"}]. L'importo (amountEur) deve essere sempre un numero positivo. Non aggiungere commenti.`;

export async function POST(request: NextRequest) {
  const session = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!(await verifySessionToken(session, "admin"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
  }

  try {
    const { text } = await request.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://artdefinance.com",
        "X-Title": "ArtDeFinance",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-lite-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text },
        ],
        temperature: 0.1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "[]";
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return NextResponse.json({ transactions: parsed });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "AI request timed out" }, { status: 504 });
    }
    return NextResponse.json({ error: "Failed to parse statement" }, { status: 500 });
  }
}
