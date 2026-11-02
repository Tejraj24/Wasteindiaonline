import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Seed StoreSettings
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "WASTE.",
      supportEmail: "concierge@wasteindiaonline.com",
      phone: "+91 98765 43210",
      address: "Studio Waste, New Delhi, India",
      currency: "INR",
      announcement: "Complimentary carbon-neutral domestic delivery across India.",
    },
  });

  // 2. Read products.json
  const productsFilePath = path.join(process.cwd(), "data", "products.json");
  if (fs.existsSync(productsFilePath)) {
    const rawData = fs.readFileSync(productsFilePath, "utf-8");
    const productsData = JSON.parse(rawData);

    // Extract unique categories
    const categoryMap = new Map<string, string>();
    for (const item of productsData) {
      if (item.category && !categoryMap.has(item.category)) {
        const slug = item.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const cat = await prisma.category.upsert({
          where: { slug },
          update: { name: item.category },
          create: {
            name: item.category,
            slug,
            description: `${item.category} collection by WASTE.`,
          },
        });
        categoryMap.set(item.category, cat.id);
      }
    }

    // Seed Products
    for (const item of productsData) {
      const categoryId = item.category ? categoryMap.get(item.category) : undefined;
      const productSlug = item.id;

      const product = await prisma.product.upsert({
        where: { slug: productSlug },
        update: {
          name: item.title,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          description: item.description || item.title,
          categoryId: categoryId || null,
          status: item.soldOut ? "DRAFT" : "ACTIVE",
          inventory: item.soldOut ? 0 : 25,
        },
        create: {
          id: item.id,
          name: item.title,
          slug: productSlug,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          description: item.description || item.title,
          shortDescription: item.description?.slice(0, 100) || item.title,
          categoryId: categoryId || null,
          status: item.soldOut ? "DRAFT" : "ACTIVE",
          inventory: item.soldOut ? 0 : 25,
          featured: Math.random() > 0.6,
          tags: [item.category, "Signature", "Heritage"].filter(Boolean),
        },
      });

      // Images
      if (Array.isArray(item.images)) {
        for (let i = 0; i < item.images.length; i++) {
          const imageUrl = item.images[i];
          const existing = await prisma.productImage.findFirst({
            where: { productId: product.id, imageUrl },
          });
          if (!existing) {
            await prisma.productImage.create({
              data: {
                productId: product.id,
                imageUrl,
                altText: `${product.name} - view ${i + 1}`,
                sortOrder: i,
              },
            });
          }
        }
      }
    }
  }

  // 3. Create initial sample orders for realistic dashboard metrics
  const sampleOrdersCount = await prisma.order.count();
  if (sampleOrdersCount === 0) {
    const products = await prisma.product.findMany({ take: 5, include: { images: true } });
    if (products.length > 0) {
      const statuses = ["DELIVERED", "SHIPPED", "CONFIRMED", "PENDING"];
      for (let i = 0; i < 6; i++) {
        const p1 = products[i % products.length];
        const p2 = products[(i + 1) % products.length];
        const qty1 = 1;
        const qty2 = i % 2 === 0 ? 2 : 1;
        const subtotal = p1.price * qty1 + p2.price * qty2;
        const tax = Math.round(subtotal * 0.18);
        const shipping = 0;
        const total = subtotal + tax + shipping;

        await prisma.order.create({
          data: {
            orderNumber: `WST-2026-${1001 + i}`,
            customerName: ["Aarav Sharma", "Priya Patel", "Rohan Mehta", "Ananya Verma", "Vikram Singh", "Diya Sen"][i],
            customerEmail: ["aarav@example.com", "priya@example.com", "rohan@example.com", "ananya@example.com", "vikram@example.com", "diya@example.com"][i],
            customerPhone: "+91 98765 0000" + i,
            subtotal,
            tax,
            shipping,
            total,
            paymentStatus: i === 3 ? "PENDING" : "PAID",
            orderStatus: statuses[i % statuses.length],
            shippingAddress: {
              addressLine1: "104 Heritage Boulevard",
              city: ["Mumbai", "Bengaluru", "Delhi", "Pune", "Hyderabad", "Kolkata"][i],
              state: "Maharashtra",
              pincode: "400001",
              country: "India",
            },
            items: {
              create: [
                {
                  productId: p1.id,
                  title: p1.name,
                  size: "M",
                  quantity: qty1,
                  price: p1.price,
                  image: p1.images[0]?.imageUrl || "",
                },
                {
                  productId: p2.id,
                  title: p2.name,
                  size: "L",
                  quantity: qty2,
                  price: p2.price,
                  image: p2.images[0]?.imageUrl || "",
                },
              ],
            },
          },
        });
      }
    }
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
