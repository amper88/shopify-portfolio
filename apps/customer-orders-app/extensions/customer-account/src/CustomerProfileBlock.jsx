import '@shopify/ui-extensions/preact';
import {render} from "preact";
import {useEffect, useState} from "preact/hooks";

const APP_URL = "https://sir-seem-vertical-geo.trycloudflare.com";

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const [message, setMessage] = useState("Loading...");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        // 👇 esto viene del runtime de Shopify
        const token = await shopify.sessionToken.get();

        const res = await fetch(`${APP_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

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
      <s-text>📦 My orders</s-text>
      {orders.map((order) => (
        <s-text key={order.id}>
          {order.orderName} — {order.totalPrice} {order.currencyCode} - {order.createdAt}
        </s-text>
      ))}
    </s-stack>
  );
}