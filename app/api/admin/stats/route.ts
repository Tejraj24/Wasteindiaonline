import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

function calculateChange(current: number, previous: number): string {
  if (previous === 0) {
    return current > 0 ? "+100%" : "0%";
  }
  const diff = ((current - previous) / previous) * 100;
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${diff.toFixed(1)}%`;
}

export async function GET(req: Request) {
  try {
    await requireAdminAuth(req);

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      paidOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      lowStockProducts,
      latestCustomers,
      thisMonthOrdersCount,
      lastMonthOrdersCount,
      thisMonthRevenueAgg,
      lastMonthRevenueAgg,
      thisMonthCustomersCount,
      lastMonthCustomersCount,
      recentSevenDaysOrders,
    ] = await Promise.all([
      // Real live counts from database
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: { in: ["PAID", "CONFIRMED"] } },
      }),
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.product.findMany({
        where: { inventory: { lte: 5 } },
        take: 6,
        include: { images: true, category: true },
        orderBy: { inventory: "asc" },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          orders: {
            select: { total: true },
          },
        },
      }),
      // Real Month-over-Month comparison metrics
      prisma.order.count({
        where: { createdAt: { gte: currentMonthStart } },
      }),
      prisma.order.count({
        where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          paymentStatus: { in: ["PAID", "CONFIRMED"] },
          createdAt: { gte: currentMonthStart },
        },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          paymentStatus: { in: ["PAID", "CONFIRMED"] },
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
      }),
      prisma.user.count({
        where: { createdAt: { gte: currentMonthStart } },
      }),
      prisma.user.count({
        where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      }),
      // Real 7-day orders for chart
      prisma.order.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: {
          total: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
    ]);

    const totalRevenue = paidOrders._sum.total || 0;
    const thisMonthRevenue = thisMonthRevenueAgg._sum.total || 0;
    const lastMonthRevenue = lastMonthRevenueAgg._sum.total || 0;

    const revenueChange = calculateChange(thisMonthRevenue, lastMonthRevenue);
    const ordersChange = calculateChange(thisMonthOrdersCount, lastMonthOrdersCount);
    const customersChange = calculateChange(thisMonthCustomersCount, lastMonthCustomersCount);

    // Build real 7-day sales overview from actual database orders
    const salesOverview = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const dayOrders = recentSevenDaysOrders.filter(
        (o) => o.createdAt >= dayStart && o.createdAt <= dayEnd
      );
      const dayPaidOrders = dayOrders.filter((o) =>
        ["PAID", "CONFIRMED"].includes(o.paymentStatus)
      );
      const daySales = dayPaidOrders.reduce((sum, o) => sum + o.total, 0);

      salesOverview.push({
        day: dayName,
        date: dayStart.toISOString().split("T")[0],
        sales: daySales,
        orders: dayOrders.length,
      });
    }

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueChange,
        ordersChange,
        customersChange,
        productsActive: totalProducts,
      },
      salesOverview,
      recentOrders,
      lowStockProducts,
      latestCustomers: latestCustomers.map((c: any) => ({
        id: c.id,
        email: c.email,
        name: c.name || c.email.split("@")[0],
        role: c.role,
        totalSpent: (c.orders || []).reduce((acc: number, o: { total: number }) => acc + o.total, 0),
        ordersCount: c.orders?.length || 0,
        createdAt: c.createdAt,
      })),
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }
    console.error("Failed to load admin stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
