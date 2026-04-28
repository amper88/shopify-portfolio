# Customer Orders App (Shopify App)

A Shopify app built with **Shopify App + Remix + Prisma + Customer Account UI Extension**.

This project demonstrates a real-world architecture where:

- Shopify webhooks sync orders into a local database
- Orders are cached in Prisma (`OrderCache`)
- A Customer Account UI Extension displays synced orders inside **My Account**
- The extension securely fetches data from the backend using **Session Tokens (JWT)**
- App Proxy is available for storefront/theme integrations
- A future cron sync acts as a fallback if webhooks fail

---

# Tech Stack

- Shopify App (Remix)
- React Router / Node.js
- Prisma + SQLite (dev)
- Customer Account UI Extension
- Shopify Webhooks
- Shopify App Proxy
- JWT validation (`jsonwebtoken`)
- Cloudflare tunnel (Shopify CLI dev)
- Ready for Railway deployment (production)

---

# Features

## 1. Order Sync via Webhook

When an order is created in Shopify:

```text
orders/create
```

The webhook:

- validates Shopify request
- receives order payload
- extracts relevant data
- stores / updates the order inside Prisma

### Stored fields

- shop
- shopifyOrderId
- orderName
- customerId
- customerEmail
- totalPrice
- currencyCode
- createdAtShopify

---

## 2. Customer Account UI Extension

A Customer Account UI Extension is injected inside:

```text
customer-account.profile.block.render
```

This displays synced customer orders directly inside:

```text
My Account → Profile
```

### Example

```text
📦 My Orders
#1004 — 749.95 USD
#1003 — 629.95 USD
```

---

## 3. Secure Backend API for Extensions

The extension calls:

```text
/api/orders
```

instead of using App Proxy.

Why?

Because Customer Account Extensions run from Shopify CDN (`extensions.shopifycdn.com`) and require:

- direct backend endpoint
- CORS enabled
- Session Token authentication

App Proxy is ideal for themes/storefront, but not for extension runtime.

---

## 4. Session Token Authentication

The extension requests a Shopify Session Token:

```js
const token = await shopify.sessionToken.get();
```

Then sends it to the backend:

```js
Authorization: Bearer <token>
```

Backend validates JWT using:

```text
SHOPIFY_API_SECRET
```

Then extracts:

```text
decoded.sub
```

Example:

```text
gid://shopify/Customer/9315684319274
```

This ensures:

- authenticated customer only
- secure access
- customer-specific order filtering

---

## 5. Customer Filtering

Orders are filtered by the authenticated customer:

```js
const customerId = decoded.sub.split('/').pop();
```

Then:

```js
where: {
  customerId: customerId
}
```

This guarantees customers only see their own orders.

---

## 6. App Proxy

Configured for storefront integrations:

```text
/apps/customer-data/orders
```

Useful for:

- theme integration
- Liquid templates
- storefront requests

Not used for Customer Account Extensions due to CORS/runtime limitations.

---

## 7. Future Cron Sync (Reconciliation)

Architecture includes a future fallback sync:

```text
/cron/sync-orders
```

Purpose:

- recover missed webhooks
- re-sync recent orders
- keep DB consistent

Production flow:

```text
Railway Scheduler → /cron/sync-orders
```

This complements real-time webhooks.

---

# Architecture

```text
Shopify Order Created
        ↓
Webhook (orders/create)
        ↓
Node Backend (Remix)
        ↓
Prisma OrderCache
        ↑
Cron Sync (future)
        ↑
Customer Account Extension
        ↓
/api/orders (JWT validated)
```

---

# Local Development

## Start app

```bash
shopify app dev
```

This creates:

- Cloudflare tunnel
- temporary public URL
- webhook registration
- extension preview

Example:

```text
Using URL: https://xxxxx.trycloudflare.com
```

---

## Important Note

The extension uses the current tunnel URL:

```js
const APP_URL = "https://xxxxx.trycloudflare.com";
```

This changes every time `shopify app dev` runs.

In production this will be replaced by Railway URL.

---

# Production Deployment

Recommended:

```text
Railway
```

Production setup:

- backend hosted on Railway
- stable URL
- webhooks always available
- extension fetches stable backend endpoint
- scheduler triggers cron sync

Example:

```text
https://my-app.up.railway.app
```

---

# Security Model

## Webhooks

```text
HMAC validation
```

## App Proxy

```text
Signature / HMAC validation
```

## Extensions

```text
Session Token JWT validation
```

### Rule of thumb

```text
Webhook / Proxy → validate Shopify
Extension → validate logged-in customer
```

---

# Interview Talking Point

> Built a Shopify app that synchronizes orders via webhooks into Prisma and exposes them securely inside Customer Account using a UI Extension authenticated with Shopify Session Tokens and customer-level filtering.

This demonstrates:

- Shopify backend architecture
- Admin API understanding
- Webhooks
- Extensions
- Security patterns
- Production-ready app design

---

# Next Improvements

- Cron sync using offline sessions
- Multi-store support
- Better admin dashboard UI
- Manual sync button inside embedded app
- Order detail view
- ERP / SAP integration layer
- Fulfillment sync
- Better monitoring + alerting

---

# Portfolio

This project is part of my Shopify portfolio:

```text
https://github.com/amper88/shopify-portfolio
```

It represents a production-style architecture for customer order visibility and backend synchronization inside Shopify.

