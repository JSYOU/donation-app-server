import { prisma } from "../utils/prismaClient";

interface RepoParams {
  page: number;
  limit: number;
  category?: string;
  keyword?: string;
  status?: string;
}

export async function getProjectRepository(params: RepoParams) {
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

  const [projects, totalCount] = await Promise.all([
    prisma.project.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.count({
      where: whereClause,
    }),
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
