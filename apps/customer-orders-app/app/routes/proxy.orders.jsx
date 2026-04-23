import { data } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.public.appProxy(request);

  if (!session) {
    return data({ error: "Unauthorized" }, { status: 401 });
  }

  const shop = session.shop;

  const orders = await db.orderCache.findMany({
    where: { shop },
    orderBy: { createdAtShopify: "desc" },
    take: 10,
  });

  return data({
    orders: orders.map((order) => ({
      id: order.shopifyOrderId,
      name: order.orderName,
      email: order.customerEmail,
      total: order.totalPrice,
      currency: order.currencyCode,
      createdAt: order.createdAtShopify,
    })),
  });
};
