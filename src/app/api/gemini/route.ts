"use server";

import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing Gemini API key in environment variables");
      return Response.json(
        { error: "Gemini API key is not configured on the server." },
        { status: 500 }
      );
    }

    console.log(
      `API key present: ${
        apiKey.length
      } characters, starts with: ${apiKey.substring(0, 4)}...`
    );

    const { prompt } = await request.json();
    if (!prompt) {
      return Response.json({ error: "No prompt provided" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: process.env.GEMINI_SYSTEM_INSTRUCTION,
      },
    });

    const generatedText = result.text || "";

    return Response.json({
      text: generatedText,
    });
  } catch (error) {
    console.error("Error in Gemini API route:", error);

    let errorMessage = "Failed to process request";

    const errorStr = String(error);
    if (
      errorStr.includes("API key not valid") ||
      errorStr.includes("API_KEY_INVALID")
    ) {
      console.error(
        "API key validation failed. Please check your Gemini API key."
      );
      errorMessage =
        "API key validation failed. Please contact the administrator.";
    }

    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
