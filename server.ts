import express from "express";
import dotenv from "dotenv";
import path from "path";

import { campaignRouter } from "./src/routes/campaign.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

app.use("/api/v1/campaigns", campaignRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
