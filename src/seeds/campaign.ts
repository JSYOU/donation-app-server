import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { CampaignType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
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

  const types: CampaignType[] = ["CHARITY", "PROJECT", "PRODUCT"];

  for (let i = 0; i < 300; i++) {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];

    await prisma.campaign.create({
      data: {
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        logoUrl: "http://localhost:8080/test_logo.jpeg",
        category: randomCategory,
        type: randomType,
      },
    });
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
