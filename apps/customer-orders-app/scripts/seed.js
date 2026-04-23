import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderCache.create({
    data: {
      shop: "amper-dev-store.myshopify.com",
      shopifyOrderId: "123",
      orderName: "#1001",
      customerEmail: "test@test.com",
      totalPrice: "150.00",
      currencyCode: "USD",
      createdAtShopify: new Date(),
    },
  });

  console.log("Seed done");
}

main();
