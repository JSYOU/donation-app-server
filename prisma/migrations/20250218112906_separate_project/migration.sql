/*
  Warnings:

  - The values [PROJECT] on the enum `CampaignType` will be removed. If these variants are still used in the database, this will fail.

*/

-- 1) 新增 enum: Status (若 Prisma 未自動生成)
CREATE TYPE "Status" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'COMPLETED');

-- 2) 新增新的 enum CampaignType_new (移除 PROJECT)
CREATE TYPE "CampaignType_new" AS ENUM ('CHARITY', 'PRODUCT');

-- 3) 在 Campaign 表新增 status 欄位 (使用 Status enum)
ALTER TABLE "Campaign"
ADD COLUMN "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- 4) 建立新的 Project 表
CREATE TABLE "Project" (
  "id"          uuid NOT NULL DEFAULT gen_random_uuid(),
  "bannerUrl"   text,
  "name"        text NOT NULL,
  "category"    text[] NOT NULL DEFAULT '{}',
  "description" text,
  "status"      "Status" NOT NULL DEFAULT 'ACTIVE',
  "createdAt"   timestamp(3) NOT NULL DEFAULT now(),
  "updatedAt"   timestamp(3) NOT NULL,
  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- 5) 將舊 Campaign 表中 type='PROJECT' 的資料搬到 Project 表
--   - 假設想把 Campaign.logoUrl 當作 Project.bannerUrl
--   - status 先給 'ACTIVE' 或其他預設
INSERT INTO "Project" (
  "id", "bannerUrl", "name", "category", "description", "status", "createdAt", "updatedAt"
)
SELECT
  "id",
  "logoUrl" as "bannerUrl",
  "name",
  "category",
  "description",
  'ACTIVE',
  "createdAt",
  "updatedAt"
FROM "Campaign"
WHERE "type" = 'PROJECT';

-- 6) 刪除 Campaign 表中 type='PROJECT' 的舊資料
DELETE FROM "Campaign"
WHERE "type" = 'PROJECT';

-- 7) 變更 Campaign.type 欄位型別為新的 CampaignType_new
ALTER TABLE "Campaign"
  ALTER COLUMN "type" TYPE "CampaignType_new"
  USING "type"::text::"CampaignType_new";

-- 8) 丟棄舊的 CampaignType enum
DROP TYPE "CampaignType";

-- 9) 將 CampaignType_new 改名為 CampaignType
ALTER TYPE "CampaignType_new" RENAME TO "CampaignType";
