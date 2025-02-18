import { Router } from "express";
import { getProjectController } from "../controllers/project.controller";

export const projectRouter = Router();

/**
 * GET /api/v1/projects
 * 查詢捐款專案列表
 * 支援 Query:
 * - page, limit
 * - category (若要篩選陣列中是否包含該分類)
 * - keyword (模糊搜尋 name / description)
 * - status (篩選狀態，如 ACTIVE / COMPLETED / INACTIVE / DRAFT)
 */
projectRouter.get("/", getProjectController);
