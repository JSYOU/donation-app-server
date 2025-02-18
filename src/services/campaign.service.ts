import { getCampaignsRepository } from "../repositories/campaign.repository";
import { Status } from "@prisma/client";

interface GetCampaignsParams {
  page: number;
  limit: number;
  category?: string;
  keyword?: string;
  status?: Status;
}

const ALLOWED_CATEGORIES = [
  "兒少照護",
  "動物保護",
  "老人照護",
  "身心障礙服務",
  "特殊醫病",
  "婦女關懷",
  "教育議題提倡",
  "環境保護",
  "多元族群",
  "媒體傳播",
  "公共議題",
  "文教藝術",
  "社區發展",
  "弱勢扶貧",
  "國際救援",
];

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
