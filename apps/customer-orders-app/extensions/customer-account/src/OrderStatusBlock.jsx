import '@shopify/ui-extensions/preact';
import {render} from "preact";
import {useEffect, useState} from "preact/hooks";

const APP_URL = "https://hiking-knee-scratch-hits.trycloudflare.com";

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const [message, setMessage] = useState("Loading...");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch(`${APP_URL}/api/orders`);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        console.log("DATA", data);

        if (!data.orders || data.orders.length === 0) {
          setMessage("No synced orders");
          return;
        }

        setOrders(data.orders);
        setMessage("");
      } catch (err) {
        console.error(err);
        setMessage("Error loading orders");
      }
    }

    loadOrders();
  }, []);

  if (message) {
    return (
      <s-banner>
        <s-text>{message}</s-text>
      </s-banner>
    );
  }

  return (
    <s-stack>
      <s-text>📦 Synced orders</s-text>
      {orders.map((order) => (
        <s-text key={order.id}>
          {order.name} — {order.total || ""} {order.currency || ""}
        </s-text>
      ))}
    </s-stack>
  );
}