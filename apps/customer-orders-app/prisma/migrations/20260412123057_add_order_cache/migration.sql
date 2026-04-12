-- CreateTable
CREATE TABLE "OrderCache" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "shopifyOrderId" TEXT NOT NULL,
    "orderName" TEXT NOT NULL,
    "customerId" TEXT,
    "customerEmail" TEXT,
    "totalPrice" TEXT,
    "currencyCode" TEXT,
    "createdAtShopify" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderCache_shopifyOrderId_key" ON "OrderCache"("shopifyOrderId");
