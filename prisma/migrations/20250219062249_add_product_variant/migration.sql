/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.

*/
-- 1) 建立新的 ProductVariant 表
CREATE TABLE "ProductVariant" (
  "id"          uuid NOT NULL DEFAULT gen_random_uuid(),
  "productId"   uuid NOT NULL,
  "variantName" text,
  "price"       integer NOT NULL DEFAULT 0,
  "stock"       integer,
  "imageUrl"    text,
  "status"      "Status" NOT NULL DEFAULT 'ACTIVE',
  "createdAt"   timestamp(3) NOT NULL DEFAULT now(),
  "updatedAt"   timestamp(3) NOT NULL,
  CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- 2) 調整 Product 表
--   - 新增 brandName 欄位
--   - 移除舊的 price 欄位
ALTER TABLE "Product"
  ADD COLUMN "brandName" text;

ALTER TABLE "Product"
  DROP COLUMN "price";

-- 3) 設定 ProductVariant 與 Product 的關聯
ALTER TABLE "ProductVariant"
  ADD CONSTRAINT "ProductVariant_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;
