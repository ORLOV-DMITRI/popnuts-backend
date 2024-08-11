-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CartProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "discountPercentage" REAL NOT NULL,
    "rating" REAL NOT NULL,
    "brand" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "CartProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CartProduct" ("brand", "discountPercentage", "id", "price", "productId", "rating", "stock", "thumbnail", "title", "userId") SELECT "brand", "discountPercentage", "id", "price", "productId", "rating", "stock", "thumbnail", "title", "userId" FROM "CartProduct";
DROP TABLE "CartProduct";
ALTER TABLE "new_CartProduct" RENAME TO "CartProduct";
CREATE UNIQUE INDEX "CartProduct_productId_userId_key" ON "CartProduct"("productId", "userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
