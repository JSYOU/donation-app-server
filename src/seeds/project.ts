import { PrismaClient, Status } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

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

const statuses: Status[] = ["DRAFT", "ACTIVE", "INACTIVE", "COMPLETED"];

function pickRandomCategories(source: string[], count: number): string[] {
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function main() {
  for (let i = 0; i < 100; i++) {
    const randomCategoryList = pickRandomCategories(categories, 3);

    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    await prisma.project.create({
      data: {
        bannerUrl: "http://localhost:8080/test_banner.jpeg",
        name: faker.company.name(),
        category: randomCategoryList,
        description: faker.lorem.sentence(),
        status: randomStatus,
      },
    });
  }

  console.log("✅ Project seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
