import { getProjectRepository } from "../repositories/project.repository";
import { Status } from "@prisma/client";

// 定義查詢參數介面
interface GetProjectsParams {
  page: number;
  limit: number;
  category?: string; // 若要依單一分類篩選
  keyword?: string;
  status?: Status; // e.g. 'ACTIVE', 'COMPLETED', 'INACTIVE', 'DRAFT'
}

export async function getProjectService(params: GetProjectsParams) {
  let { page, limit, category, keyword, status } = params;

  if (page < 1) {
    page = 1;
  }
  if (limit < 1) {
    limit = 10;
  } else if (limit > 100) {
    limit = 100;
  }

  if (status && !Object.values(Status).includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  return await getProjectRepository({
    page,
    limit,
    category,
    keyword,
    status,
  });
}
