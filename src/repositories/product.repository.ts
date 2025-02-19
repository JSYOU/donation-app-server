import { prisma } from "../utils/prismaClient";

interface RepoParams {
  page: number;
  limit: number;
  category?: string;
  keyword?: string;
  status?: string;
}

/**
 * 取得 Product 列表，支援分頁、分類、關鍵字與狀態篩選
 * 並計算每個商品的 priceMin / priceMax
 */
export async function getProductsRepository(params: RepoParams) {
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

  // 同步查詢商品 + 計算總數
  const [rawProducts, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        variants: {
          select: { price: true },
        },
      },
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  // 計算每個商品的 priceMin / priceMax
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

  // 回傳列表與分頁資訊
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
