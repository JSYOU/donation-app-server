import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import { campaignRouter } from "./src/routes/campaign.routes";
import { projectRouter } from "./src/routes/project.routes";
import { productRouter } from "./src/routes/product.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

app.use("/api/v1/campaigns", campaignRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/products", productRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
