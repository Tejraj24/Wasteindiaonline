import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/account
 * Returns the authenticated administrator's profile and database status.
 */
export async function GET(req: Request) {
  try {
    const auth = await requireAdminAuth(req);

    if (!auth.dbUser) {
      return NextResponse.json({ error: "Administrator record not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: auth.dbUser.id,
      email: auth.dbUser.email,
      name: auth.dbUser.name,
      phone: auth.dbUser.phone,
      role: auth.role,
      createdAt: auth.dbUser.createdAt,
      updatedAt: auth.dbUser.updatedAt,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("GET /api/admin/account error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/account
 * Updates the administrator's profile metadata in the database (name, phone).
 * Role changes are strictly forbidden from this endpoint.
 */
export async function PUT(req: Request) {
  try {
    const auth = await requireAdminAuth(req);

    if (!auth.dbUser) {
      return NextResponse.json({ error: "Administrator record not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, phone } = body;

    const updated = await prisma.user.update({
      where: { id: auth.dbUser.id },
      data: {
        ...(typeof name === "string" ? { name: name.trim() } : {}),
        ...(typeof phone === "string" ? { phone: phone.trim() } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        phone: updated.phone,
        role: updated.role,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("PUT /api/admin/account error:", error);
    return NextResponse.json({ error: "Failed to update administrator profile" }, { status: 500 });
  }
}
