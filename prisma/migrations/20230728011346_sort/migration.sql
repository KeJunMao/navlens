-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "sort" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Group" ("code", "icon", "id", "name") SELECT "code", "icon", "id", "name" FROM "Group";

UPDATE "new_Group" SET sort = 0;
UPDATE "new_Group"
SET sort = (SELECT COUNT(*) FROM "new_Group" t WHERE t.sort <= "new_Group".sort);

DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
CREATE UNIQUE INDEX "Group_code_key" ON "Group"("code");
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "groupId" INTEGER NOT NULL,
    CONSTRAINT "Category_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("groupId", "icon", "id", "name") SELECT "groupId", "icon", "id", "name" FROM "Category";
UPDATE "new_Category" SET sort = 0;
UPDATE "new_Category"
SET sort = (SELECT COUNT(*) FROM "new_Category" t WHERE t.sort <= "new_Category".sort);

DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_Url" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "link" TEXT NOT NULL,
    "label" TEXT,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "siteId" INTEGER NOT NULL,
    CONSTRAINT "Url_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Url" ("id", "label", "link", "siteId") SELECT "id", "label", "link", "siteId" FROM "Url";
UPDATE "new_Url" SET sort = 0;
UPDATE "new_Url"
SET sort = (SELECT COUNT(*) FROM "new_Url" t WHERE t.sort <= "new_Url".sort);
DROP TABLE "Url";
ALTER TABLE "new_Url" RENAME TO "Url";
CREATE TABLE "new_Site" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "showQrcode" BOOLEAN NOT NULL DEFAULT false,
    "sort" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Site" ("description", "icon", "id", "name", "showQrcode") SELECT "description", "icon", "id", "name", "showQrcode" FROM "Site";
UPDATE "new_Site" SET sort = 0;
UPDATE "new_Site"
SET sort = (SELECT COUNT(*) FROM "new_Site" t WHERE t.sort <= "new_Site".sort);
DROP TABLE "Site";
ALTER TABLE "new_Site" RENAME TO "Site";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
