import { Request, Response } from "express";
import { Status } from "@prisma/client";

import { getCampaignsService } from "../services/campaign.service";

export async function getCampaignsController(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const keyword = req.query.keyword as string;
    const status = req.query.status as Status;

    const result = await getCampaignsService({
      page,
      limit,
      category,
      keyword,
      status,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("getCampaignsController Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
