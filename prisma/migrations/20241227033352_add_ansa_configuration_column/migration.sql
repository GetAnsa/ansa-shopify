/*
  Warnings:

  - You are about to drop the column `accountName` on the `Configuration` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "ansaMerchantId" TEXT NOT NULL DEFAULT '',
    "ansaMerchantSecretKey" TEXT NOT NULL DEFAULT '',
    "ready" BOOLEAN NOT NULL DEFAULT true,
    "apiVersion" TEXT NOT NULL DEFAULT 'unstable',
    CONSTRAINT "Configuration_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Configuration" ("apiVersion", "id", "ready", "sessionId", "shop") SELECT "apiVersion", "id", "ready", "sessionId", "shop" FROM "Configuration";
DROP TABLE "Configuration";
ALTER TABLE "new_Configuration" RENAME TO "Configuration";
CREATE UNIQUE INDEX "Configuration_sessionId_key" ON "Configuration"("sessionId");
CREATE INDEX "Configuration_sessionId_idx" ON "Configuration"("sessionId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
