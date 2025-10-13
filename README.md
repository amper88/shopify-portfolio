# Shopify Portfolio – Amper Clothing Co.

**Live Demo:**  
[https://amper-myportfolio.myshopify.com](https://amper-myportfolio.myshopify.com)  

**Product Example (Metaobjects in action):**  
[Amper Cap](https://amper-myportfolio.myshopify.com/products/amper-cap)

---

## Overview

This repository contains a **custom Shopify theme** (based on Dawn) and example API integrations built as part of a **developer portfolio** to showcase advanced Shopify skills.

Highlights:

- **Shopify Theme Development** (Liquid, section schema, and Dawn customization)  
- **Storefront & Admin GraphQL API** (queries, mutations, metafields, and metaobjects)  
- **Custom Logic Integration** (metaobject linking, dynamic rendering, and conditional schemas)  
- **Scalable Theme Architecture** (snippets, schema-based toggles, and reusable components)

---

## Structure

| Folder | Description |
|---------|--------------|
| `/theme-amper/` | Customized Shopify theme used for the demo (based on Dawn). |
| `/theme-amper/snippets/` | Custom Liquid snippets for metafields and metaobjects. |
| `/theme-amper/sections/` | Modified sections (including Footer with schema toggle). |
| `/scripts/graphql/` | GraphQL queries and mutations for creating metafields & metaobjects. |
| `/apps/` | Placeholder for private app examples (Node.js + React). |

---

### ✨ Implemented Features

**Metafields:** Custom “Delivery Note” displayed per product.  
**Metaobjects:** ProductSpecs (Material, Warranty) linked via reference.  
**Footer Integration:** StoreInfo metaobject (Email, Phone) toggleable via Theme Editor.  
**GraphQL Scripts:** Includes ready-to-run mutations to create metafields, metaobjects, and product references.  
**Announcement Scheduler App:** Custom app built with Node.js + React (Polaris) to manage timed store announcements.