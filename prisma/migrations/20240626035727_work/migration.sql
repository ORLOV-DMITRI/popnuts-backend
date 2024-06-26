-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkSpace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAd" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    CONSTRAINT "WorkSpace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_WorkSpace" ("id", "name", "userId") SELECT "id", "name", "userId" FROM "WorkSpace";
DROP TABLE "WorkSpace";
ALTER TABLE "new_WorkSpace" RENAME TO "WorkSpace";
CREATE TABLE "new_Board" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAd" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "WorkSpaceId" TEXT,
    CONSTRAINT "Board_WorkSpaceId_fkey" FOREIGN KEY ("WorkSpaceId") REFERENCES "WorkSpace" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Board" ("WorkSpaceId", "id", "name") SELECT "WorkSpaceId", "id", "name" FROM "Board";
DROP TABLE "Board";
ALTER TABLE "new_Board" RENAME TO "Board";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
