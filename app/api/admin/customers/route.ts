import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdminAuth(req);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const role = searchParams.get("role") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role && (role === "ADMIN" || role === "CUSTOMER")) {
      where.role = role;
    }

    const [total, customers] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          orders: {
            select: {
              id: true,
              total: true,
              orderStatus: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
          _count: {
            select: {
              orders: true,
              wishlists: true,
            },
          },
        },
      }),
    ]);

    const formattedCustomers = customers.map((c: any) => ({
      id: c.id,
      email: c.email,
      name: c.name || c.email.split("@")[0],
      phone: c.phone || "—",
      city: c.city || "—",
      state: c.state || "—",
      country: c.country || "India",
      pincode: c.pincode || "—",
      role: c.role,
      totalSpent: (c.orders || []).reduce((acc: number, o: { total: number }) => acc + o.total, 0),
      ordersCount: c._count?.orders || 0,
      wishlistCount: c._count?.wishlists || 0,
      recentOrders: (c.orders || []).slice(0, 3),
      createdAt: c.createdAt,
    }));

    return NextResponse.json({
      customers: formattedCustomers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("GET /api/admin/customers error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdminAuth(req);
    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !role || (role !== "ADMIN" && role !== "CUSTOMER")) {
      return NextResponse.json({ error: "Valid userId and role (ADMIN or CUSTOMER) are required" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("PATCH /api/admin/customers error:", error);
    return NextResponse.json({ error: "Failed to update customer role" }, { status: 500 });
  }
}
