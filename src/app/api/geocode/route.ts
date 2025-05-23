import { NextResponse } from "next/server";

/**
 * API route to handle geocoding requests while avoiding Nominatim usage policy limitations
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Missing address parameter" },
        { status: 400 }
      );
    }

    // Add Indonesia to make search more accurate and specify country
    const searchAddress = `${address}, Indonesia`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      searchAddress
    )}&countrycodes=id&limit=1`;

    // Make the server-side request to Nominatim
    const response = await fetch(url, {
      headers: {
        "User-Agent": "ChillMind-App/1.0",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    // Check if we got results
    if (data && data.length > 0) {
      return NextResponse.json({
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      });
    } else {
      // No results found
      return NextResponse.json(
        { error: "No coordinates found for the address" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error in geocoding API:", error);
    return NextResponse.json(
      { error: "Failed to geocode address" },
      { status: 500 }
    );
  }
}
