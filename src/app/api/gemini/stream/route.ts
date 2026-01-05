"use server";

import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  const geminiSystemInstruction = process.env.GEMINI_SYSTEM_INSTRUCTION;
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

  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return Response.json({ error: "No prompt provided" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const geminiStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              systemInstruction: geminiSystemInstruction,
            },
          }); // Stream each chunk to the client
          for await (const chunk of geminiStream) {
            if (chunk.text) {
              // Encode the chunk and send it
              controller.enqueue(new TextEncoder().encode(chunk.text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Error in Gemini stream:", error);

          let errorMessage =
            "[Error: Unable to generate AI response. Please try again later.]";

          const errorStr = String(error);
          if (
            errorStr.includes("API key not valid") ||
            errorStr.includes("API_KEY_INVALID")
          ) {
            console.error(
              "API key validation failed. Please check your Gemini API key."
            );
            errorMessage =
              "[Error: API key validation failed. Please contact the administrator.]";
          }

          controller.enqueue(new TextEncoder().encode(errorMessage));
          controller.close();
        }
      },
    });

    // Return the stream
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error in Gemini API route:", error);
    return Response.json(
      { error: "Failed to process request:" + String(error) },
      { status: 500 }
    );
  }
}
