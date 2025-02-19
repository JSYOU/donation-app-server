import { PrismaClient, Status } from "@prisma/client";
import { faker } from "@faker-js/faker";

import { Categories } from "../models/categories";

const prisma = new PrismaClient();

function pickRandomCategories(source: string[], count: number): string[] {
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function main() {
  const categories = Object.values(Categories);

  const statuses: Status[] = ["DRAFT", "ACTIVE", "INACTIVE", "COMPLETED"];

  for (let i = 0; i < 300; i++) {
    const randomCategoryList = pickRandomCategories(categories, 3);
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    await prisma.campaign.create({
      data: {
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        logoUrl: "http://localhost:8080/test_logo.jpeg",
        category: randomCategoryList,
        status: randomStatus,
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
