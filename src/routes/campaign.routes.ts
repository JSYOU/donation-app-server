import { Router } from "express";
import { getCampaignsController } from "../controllers/campaign.controller";

export const campaignRouter = Router();

/**
 * GET /api/v1/campaigns
 * 取得捐款列表 (包含 公益團體, 捐款專案, 義賣商品)
 * 支援 query 參數:
 * - page, limit
 * - type (CHARITY / PROJECT / PRODUCT)
 * - category (如 animal, children...)
 * - keyword (模糊搜尋 name/description)
 */
campaignRouter.get("/", getCampaignsController);
