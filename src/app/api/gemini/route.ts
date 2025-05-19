"use server";

import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    // Get API key from server-side environment variable (no NEXT_PUBLIC_ prefix)
    const apiKey = process.env.GEMINI_API_KEY;

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

    // Parse request body
    const { prompt } = await request.json();
    if (!prompt) {
      return Response.json({ error: "No prompt provided" }, { status: 400 });
    }

    // Initialize Gemini
    const ai = new GoogleGenAI({ apiKey });

    // Handle response
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: process.env.GEMINI_SYSTEM_INSTRUCTION,
      },
    });

    // Extract the text using the correct method for this version of the API
    const generatedText = result.text || "";

    // Return the response
    return Response.json({
      text: generatedText,
    });
  } catch (error) {
    console.error("Error in Gemini API route:", error);

    // Provide more detailed error messages
    let errorMessage = "Failed to process request";

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
        "API key validation failed. Please contact the administrator.";
    }

    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
