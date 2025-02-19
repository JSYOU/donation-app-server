import { Request, Response } from "express";
import { Status } from "@prisma/client";

import { getCampaignsService } from "../services/campaign.service";
import { Categories } from "../models/categories";

/**
 * GET /api/v1/campaigns
 * 取得捐款列表 (包含 公益團體, 捐款專案, 義賣商品)
 *
 * Query 參數:
 * - page, limit
 * - category (如 animal, children...)
 * - keyword (模糊搜尋 name/description)
 * - status (如 ACTIVE/COMPLETED/INACTIVE/DRAFT)
 */
export async function getCampaignsController(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const category = req.query.category as Categories;
    const keyword = req.query.keyword as string;
    const status = req.query.status as Status;

    const result = await getCampaignsService({
      page,
      limit,
      category,
      keyword,
      status,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("getCampaignsController Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
