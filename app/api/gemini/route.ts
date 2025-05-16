import { NextResponse } from "next/server";
import openai from "@/app/utils/openai";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const message = searchParams.get("message") || "";

  if (!message) {
    return NextResponse.json({ error: "No message provided" }, { status: 400 });
  }

  try {
    const prompt = `Act as an AI recommendation system and provide relevant suggestions for: "${message}"`;
    const gptResult = await openai.generateContent(prompt);
    const text = await gptResult.response.text();
    return new Response(text);
  } catch (err) {
    console.error("OpenAI error:", err);
    return new Response("AI generation failed. Try again.", { status: 500 });
  }
}
