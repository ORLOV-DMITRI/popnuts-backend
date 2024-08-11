/*
  Warnings:

  - Added the required column `category` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `CartProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `FavoriteProduct` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "discountPercentage" REAL NOT NULL,
    "rating" REAL NOT NULL,
    "brand" TEXT,
    "quantity" INTEGER NOT NULL,
    "thumbnail" TEXT NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderItem" ("brand", "discountPercentage", "id", "orderId", "price", "productId", "quantity", "rating", "thumbnail", "title") SELECT "brand", "discountPercentage", "id", "orderId", "price", "productId", "quantity", "rating", "thumbnail", "title" FROM "OrderItem";
DROP TABLE "OrderItem";
ALTER TABLE "new_OrderItem" RENAME TO "OrderItem";
CREATE TABLE "new_CartProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "discountPercentage" REAL NOT NULL,
    "rating" REAL NOT NULL,
    "brand" TEXT,
    "stock" INTEGER NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "CartProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CartProduct" ("brand", "count", "discountPercentage", "id", "price", "productId", "rating", "stock", "thumbnail", "title", "userId") SELECT "brand", "count", "discountPercentage", "id", "price", "productId", "rating", "stock", "thumbnail", "title", "userId" FROM "CartProduct";
DROP TABLE "CartProduct";
ALTER TABLE "new_CartProduct" RENAME TO "CartProduct";
CREATE UNIQUE INDEX "CartProduct_productId_userId_key" ON "CartProduct"("productId", "userId");
CREATE TABLE "new_FavoriteProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "discountPercentage" REAL NOT NULL,
    "rating" REAL NOT NULL,
    "brand" TEXT,
    "stock" INTEGER NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "FavoriteProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FavoriteProduct" ("brand", "discountPercentage", "id", "price", "productId", "rating", "stock", "thumbnail", "title", "userId") SELECT "brand", "discountPercentage", "id", "price", "productId", "rating", "stock", "thumbnail", "title", "userId" FROM "FavoriteProduct";
DROP TABLE "FavoriteProduct";
ALTER TABLE "new_FavoriteProduct" RENAME TO "FavoriteProduct";
CREATE UNIQUE INDEX "FavoriteProduct_productId_userId_key" ON "FavoriteProduct"("productId", "userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
