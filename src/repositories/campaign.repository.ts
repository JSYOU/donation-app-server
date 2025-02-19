import { prisma } from "../utils/prismaClient";

interface RepoParams {
  page: number;
  limit: number;
  category?: string;
  keyword?: string;
  status?: string;
}

/**
 * 取得 Campaign 列表，支援分頁、分類、關鍵字與狀態篩選
 */
export async function getCampaignsRepository(params: RepoParams) {
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
  const [campaigns, totalCount] = await Promise.all([
    prisma.campaign.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.campaign.count({
      where: whereClause,
    }),
  ]);

  return {
    data: campaigns,
    meta: {
      page,
      limit,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}
