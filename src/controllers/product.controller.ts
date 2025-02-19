import { Request, Response } from "express";
import { Status } from "@prisma/client";

import { getProductsService } from "../services/product.service";
import { Categories } from "../models/categories";

/**
 * GET /api/v1/products
 * 取得商品列表
 *
 * Query 參數:
 * - page, limit
 * - category (商品分類)
 * - keyword (模糊搜尋 name/description)
 * - status (如 ACTIVE/COMPLETED/INACTIVE/DRAFT)
 */
export async function getProductsController(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const category = req.query.category as Categories;
    const keyword = req.query.keyword as string;
    const status = req.query.status as Status;

    const result = await getProductsService({
      page,
      limit,
      category,
      keyword,
      status,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("getProductsController Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
