import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const decodedToken = await verifyFirebaseToken(authHeader);

    return NextResponse.json({
      uid: decodedToken.uid,
      email: decodedToken.email ?? null,
      success: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json(
      {
        error: message,
        success: false,
      },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
