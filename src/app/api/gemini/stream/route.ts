"use server";

import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  const geminiSystemInstruction = process.env.GEMINI_SYSTEM_INSTRUCTION;
  // Get API key from server-side environment variable (no NEXT_PUBLIC_ prefix)

  // Enhanced API key validation
  if (!apiKey) {
    console.error("Missing Gemini API key in environment variables");
    return Response.json(
      { error: "Gemini API key is not configured on the server." },
      { status: 500 }
    );
  }

  // Log API key length and format (not the actual key) for debugging
  console.log(
    `API key present: ${
      apiKey.length
    } characters, starts with: ${apiKey.substring(0, 4)}...`
  );

  try {
    // Parse request body
    const { prompt } = await request.json();
    if (!prompt) {
      return Response.json({ error: "No prompt provided" }, { status: 400 });
    }

    // Initialize Gemini
    const ai = new GoogleGenAI({ apiKey });

    // Create a readable stream for streaming the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const geminiStream = await ai.models.generateContentStream({
            model: "gemini-2.0-flash-lite",
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

          // Detailed error message for API key issues
          let errorMessage =
            "[Error: Unable to generate AI response. Please try again later.]";

          // Check for API key related errors
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

          // Send plain text error message that client can display directly
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
