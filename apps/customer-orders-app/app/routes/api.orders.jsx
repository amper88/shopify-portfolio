import db from "../db.server";
import jwt from "jsonwebtoken";

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

    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET);
    } catch (err) {
      return new Response("Invalid token", { status: 401 });
    }

    const customerId = decoded.sub.split("/").pop();
    
    console.log("CUSTOMER", customerId);
    console.log("TOKEN", token);


    const orders = await db.orderCache.findMany({
      where: {
        customerId: customerId,
      },
      orderBy: { createdAtShopify: "desc" },
      take: 10,
    });

    console.log("orders", orders);

    return new Response(
      JSON.stringify({ orders }),
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
      JSON.stringify({ error: "Failed to load orders" }),
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