import { NextResponse } from "next/server";

const API_BASE_URL = "https://api-prod.himpsi.or.id/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get("endpoint");
    const queryParams = searchParams.get("params") || "";

    if (!endpoint) {
      return NextResponse.json(
        { error: "Missing required endpoint parameter" },
        { status: 400 }
      );
    }

    const apiUrl = `${API_BASE_URL}/${endpoint}${
      queryParams ? `?${queryParams}` : ""
    }`;

    console.log(`Proxy request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "ChillMind-App/1.0",
      },
    });

    const data = await response.json();

    // Return the API response
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in psychologists proxy API:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from HIMPSI API" },
      { status: 500 }
    );
  }
}
