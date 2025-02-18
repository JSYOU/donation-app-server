/*
  Warnings:

  - The `category` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/

-- 1) 先新增一個暫時欄位 (text[])，並允許預設空陣列
ALTER TABLE "Campaign"
ADD COLUMN "category_temp" text[] NOT NULL DEFAULT '{}';

-- 2) 將舊的 string 資料轉成陣列 (若為 null 就給 '{}')
UPDATE "Campaign"
SET "category_temp" = CASE
  WHEN "category" IS NOT NULL THEN ARRAY["category"]
  ELSE '{}'
END;

-- 3) 刪除原本的欄位
ALTER TABLE "Campaign"
DROP COLUMN "category";

-- 4) 將暫時欄位改名為 category
ALTER TABLE "Campaign"
RENAME COLUMN "category_temp" TO "category";

