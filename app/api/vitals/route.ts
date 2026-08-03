import { NextResponse } from "next/server";

/**
 * Accepts web-vitals beacons in production.
 * Logs server-side; swap for a real analytics sink later if needed.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "production") {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const metric = await request.json();
    console.info("[web-vital]", metric);
  } catch {
    // Ignore malformed beacons
  }

  return new NextResponse(null, { status: 204 });
}
