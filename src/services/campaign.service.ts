import { Status } from "@prisma/client";

import { getCampaignsRepository } from "../repositories/campaign.repository";
import { Categories } from "../models/categories";

interface GetCampaignsParams {
  page: number;
  limit: number;
  category?: Categories;
  keyword?: string;
  status?: Status;
}

const ALLOWED_CATEGORIES = Object.values(Categories);

export async function getCampaignsService(params: GetCampaignsParams) {
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

  if (category && !ALLOWED_CATEGORIES.includes(category)) {
    throw new Error(
      `Invalid category: ${category}. Must be one of: ${ALLOWED_CATEGORIES.join(
        ", "
      )}`
    );
  }

  return getCampaignsRepository({
    page,
    limit,
    category,
    keyword,
    status,
  });
}
