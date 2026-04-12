import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  console.log("WEBHOOK HIT: orders-create");

  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log("WEBHOOK AUTH OK", {
    topic,
    shop,
    orderId: payload?.id,
    orderName: payload?.name,
    email: payload?.email,
    customerEmail: payload?.customer?.email,
  });

  if (topic !== "ORDERS_CREATE") {
    console.log("WEBHOOK IGNORED", topic);
    return new Response("Ignored", { status: 200 });
  }

  const shopifyOrderId = String(payload.id);

  await db.orderCache.upsert({
    where: { shopifyOrderId },
    update: {
      shop,
      orderName: payload.name ?? "",
      customerId: payload.customer?.id ? String(payload.customer.id) : null,
      customerEmail: payload.email ?? payload.customer?.email ?? null,
      totalPrice: payload.total_price ?? null,
      currencyCode: payload.currency ?? null,
      createdAtShopify: payload.created_at ? new Date(payload.created_at) : null,
    },
    create: {
      shop,
      shopifyOrderId,
      orderName: payload.name ?? "",
      customerId: payload.customer?.id ? String(payload.customer.id) : null,
      customerEmail: payload.email ?? payload.customer?.email ?? null,
      totalPrice: payload.total_price ?? null,
      currencyCode: payload.currency ?? null,
      createdAtShopify: payload.created_at ? new Date(payload.created_at) : null,
    },
  });

  console.log("WEBHOOK DB UPSERT OK", {
    shopifyOrderId,
    shop,
  });

  return new Response("OK", { status: 200 });
};