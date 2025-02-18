/*
  Warnings:

  - You are about to drop the column `type` on the `Campaign` table. All the data in the column will be lost.

*/
-- 1) 建立新的 Product 表
CREATE TABLE "Product" (
  "id"          uuid         NOT NULL DEFAULT gen_random_uuid(),
  "name"        text         NOT NULL,
  "imageUrl"    text,
  "price"       integer      NOT NULL DEFAULT 0, -- 預設值
  "category"    text[]       NOT NULL DEFAULT '{}',
  "description" text,
  "status"      "Status"     NOT NULL DEFAULT 'ACTIVE',
  "createdAt"   timestamp(3) NOT NULL DEFAULT now(),
  "updatedAt"   timestamp(3) NOT NULL,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- 2) 將 Campaign 中 type='PRODUCT' 的資料搬到 Product 表
--    假設要把 Campaign.logoUrl -> Product.imageUrl
INSERT INTO "Product" (
  "id",
  "name",
  "imageUrl",
  "category",
  "description",
  "status",
  "createdAt",
  "updatedAt",
  "price"
)
SELECT
  "id",
  "name",
  "logoUrl",
  "category",
  "description",
  "status",
  "createdAt",
  "updatedAt",
  0
FROM "Campaign"
WHERE "type" = 'PRODUCT';

-- 3) 刪除 Campaign 表中 type='PRODUCT' 的紀錄
DELETE FROM "Campaign"
WHERE "type" = 'PRODUCT';

-- 4) 移除 Campaign 表中的 type 欄位
ALTER TABLE "Campaign"
DROP COLUMN "type";

-- 5) 丟棄舊的 CampaignType enum
DROP TYPE "CampaignType";
