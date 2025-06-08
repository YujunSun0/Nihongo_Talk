import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, characterPrompt } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No API key set" }, { status: 500 });
  }

  const systemPrompt = characterPrompt || "당신은 일본인 회화 파트너입니다. 친절하고 자연스럽게 일본어로 대화해 주세요.";

  const payload = {
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    temperature: 0.8,
    max_tokens: 512,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error }, { status: response.status });
  }

  const data = await response.json();
  const aiMessage = data.choices?.[0]?.message?.content || "";
  return NextResponse.json({ message: aiMessage });
} 