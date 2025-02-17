import { Request, Response } from "express";
import { CampaignType } from "@prisma/client";

import { getCampaignsService } from "../services/campaign.service";

export async function getCampaignsController(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const type = parseCampaignType(req.query.type as string);
    const category = req.query.category as string;
    const keyword = req.query.keyword as string;

    const result = await getCampaignsService({
      page,
      limit,
      type,
      category,
      keyword,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("getCampaignsController Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

function parseCampaignType(
  typeStr: string | undefined
): CampaignType | undefined {
  if (!typeStr) return undefined;
  if (Object.values(CampaignType).includes(typeStr as CampaignType)) {
    return typeStr as CampaignType;
  }
  throw new Error(`Invalid type: ${typeStr}`);
}
