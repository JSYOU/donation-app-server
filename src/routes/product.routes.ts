import { Router } from "express";
import { getProductsController } from "../controllers/product.controller";

export const productRouter = Router();

/**
 * GET /api/v1/products
 * 取得商品列表
 *
 * 支援 Query 參數:
 * - page, limit
 * - category (商品分類)
 * - keyword (模糊搜尋 name/description)
 * - status (如 ACTIVE / COMPLETED / INACTIVE / DRAFT)
 */
productRouter.get("/", getProductsController);
