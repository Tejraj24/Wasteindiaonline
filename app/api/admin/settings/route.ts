import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdminAuth(req);

    let settings = await prisma.storeSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: "default",
          storeName: "WASTE.",
          supportEmail: "concierge@wasteindiaonline.com",
          phone: "+91 98765 43210",
          address: "Studio Waste, New Delhi, India",
          currency: "INR",
          announcement: "Complimentary carbon-neutral domestic delivery across India.",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdminAuth(req);
    const body = await req.json();

    const {
      storeName,
      logo,
      supportEmail,
      phone,
      address,
      currency,
      instagram,
      twitter,
      announcement,
    } = body;

    const updated = await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: {
        storeName,
        logo,
        supportEmail,
        phone,
        address,
        currency,
        instagram,
        twitter,
        announcement,
      },
      create: {
        id: "default",
        storeName: storeName || "WASTE.",
        logo,
        supportEmail: supportEmail || "concierge@wasteindiaonline.com",
        phone: phone || "+91 98765 43210",
        address: address || "Studio Waste, New Delhi, India",
        currency: currency || "INR",
        instagram,
        twitter,
        announcement,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("PUT /api/admin/settings error:", error);
    return NextResponse.json({ error: "Failed to update store settings" }, { status: 500 });
  }
}
