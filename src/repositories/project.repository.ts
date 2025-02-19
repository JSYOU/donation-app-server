import { prisma } from "../utils/prismaClient";

interface RepoParams {
  page: number;
  limit: number;
  category?: string;
  keyword?: string;
  status?: string;
}

/**
 * 取得 Project 列表，支援分頁、分類、關鍵字與狀態篩選
 */
export async function getProjectRepository(params: RepoParams) {
  const { page, limit, category, keyword, status } = params;
  const skip = (page - 1) * limit;

  // 建立 where 條件
  const whereClause: any = {};

  if (category) {
    whereClause.category = { has: category };
  }
  if (keyword) {
    whereClause.OR = [
      { name: { contains: keyword } },
      { description: { contains: keyword } },
    ];
  }
  if (status) {
    whereClause.status = status;
  }

  // 同步查詢 + 計算總數
  const [projects, totalCount] = await Promise.all([
    prisma.project.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.count({ where: whereClause }),
  ]);

  return {
    data: projects,
    meta: {
      page,
      limit,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}
