import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    console.log("[API /api/auth/me] Received GET request");
    const auth = await verifyAuthToken(req);

    if (!auth || !auth.dbUser) {
      console.log("[API /api/auth/me] verifyAuthToken returned null or no dbUser. Responding with null user/CUSTOMER role.");
      return NextResponse.json({ user: null, role: "CUSTOMER", isAdmin: false });
    }

    const payload = {
      user: {
        id: auth.dbUser.id,
        email: auth.dbUser.email,
        name: auth.dbUser.name,
        role: auth.role,
        phone: auth.dbUser.phone,
        address: auth.dbUser.address,
        city: auth.dbUser.city,
        state: auth.dbUser.state,
        country: auth.dbUser.country,
        pincode: auth.dbUser.pincode,
      },
      role: auth.role,
      isAdmin: auth.role === "ADMIN",
    };

    console.log("[API /api/auth/me] Responding with payload:", payload);
    return NextResponse.json(payload);
  } catch (error: unknown) {
    console.error("[API /api/auth/me] Error handling request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
