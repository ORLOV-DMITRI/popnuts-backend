-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FavoriteProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
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
