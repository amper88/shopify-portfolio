import db from "../db.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const loader = async ({ request }) => {
  try {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const orders = await db.orderCache.findMany({
      orderBy: { createdAtShopify: "desc" },
      take: 10,
    });

    return new Response(
      JSON.stringify({
        orders: orders.map((order) => ({
          id: order.shopifyOrderId,
          name: order.orderName,
          email: order.customerEmail,
          total: order.totalPrice,
          currency: order.currencyCode,
          createdAt: order.createdAtShopify,
        })),
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("API /orders ERROR", error);

    return new Response(
      JSON.stringify({
        error: "Failed to load orders",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
};