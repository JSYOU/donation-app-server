import { Status } from "@prisma/client";
import { getProjectRepository } from "../repositories/project.repository";
import { Categories } from "../models/categories";

interface GetProjectsParams {
  page: number;
  limit: number;
  category?: Categories;
  keyword?: string;
  status?: Status;
}

const ALLOWED_CATEGORIES = Object.values(Categories);

export async function getProjectService(params: GetProjectsParams) {
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

  return getProjectRepository({
    page,
    limit,
    category,
    keyword,
    status,
  });
}
