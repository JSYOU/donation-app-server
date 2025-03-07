import { Status } from "@prisma/client";
import { getProductsRepository } from "../repositories/product.repository";
import { Categories } from "../models/categories";

interface GetProductsParams {
  page: number;
  limit: number;
  category?: Categories;
  keyword?: string;
  status?: Status;
}

const ALLOWED_CATEGORIES = Object.values(Categories);

export async function getProductsService(params: GetProductsParams) {
  let { page, limit, category, keyword, status } = params;

  // 分頁參數
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  else if (limit > 100) limit = 100;

  // 驗證 status
  if (status && !Object.values(Status).includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  // 驗證 category
  if (category && !ALLOWED_CATEGORIES.includes(category)) {
    throw new Error(
      `Invalid category: ${category}. Must be one of: ${ALLOWED_CATEGORIES.join(
        ", "
      )}`
    );
  }

  return getProductsRepository({
    page,
    limit,
    category,
    keyword,
    status,
  });
}
