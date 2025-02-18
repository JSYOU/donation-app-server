import { prisma } from "../utils/prismaClient";

interface RepoParams {
  page: number;
  limit: number;
  category?: string;
  keyword?: string;
  status?: string;
}

export async function getCampaignsRepository(params: RepoParams) {
  const { page, limit, category, keyword, status } = params;
  const skip = (page - 1) * limit;
  const whereClause: any = {};

  if (category) {
    whereClause.category = {
      has: category,
    };
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
