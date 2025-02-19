import { prisma } from "../utils/prismaClient";

interface RepoParams {
  page: number;
  limit: number;
  category?: string;
  keyword?: string;
  status?: string;
}

export async function getProductsRepository(params: RepoParams) {
  const { page, limit, category, keyword, status } = params;
  const skip = (page - 1) * limit;

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

  // 1) 同步查詢商品 + 計算總數
  const [rawProducts, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      // 關鍵：include variants 的 price
      include: {
        variants: {
          select: { price: true },
        },
      },
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  // 2) 計算每個商品的 priceMin 與 priceMax
  const products = rawProducts.map((product) => {
    const prices = product.variants.map((v) => v.price);
    const priceMin = prices.length ? Math.min(...prices) : 0;
    const priceMax = prices.length ? Math.max(...prices) : 0;
    return {
      ...product,
      priceMin,
      priceMax,
    };
  });

  // 3) 回傳列表與分頁資訊
  return {
    data: products,
    meta: {
      page,
      limit,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}
