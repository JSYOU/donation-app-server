import { PrismaClient, Status } from "@prisma/client";
import { faker } from "@faker-js/faker";

import { Categories } from "../models/categories";

const prisma = new PrismaClient();

const categories = Object.values(Categories);

const statuses: Status[] = ["DRAFT", "ACTIVE", "INACTIVE", "COMPLETED"];

function pickRandomCategories(source: string[], count: number): string[] {
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function main() {
  for (let i = 0; i < 100; i++) {
    const randomCategoryList = pickRandomCategories(
      categories,
      faker.number.int({ min: 1, max: 3 })
    );

    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const variantCount = faker.number.int({ min: 1, max: 3 });
    const variantsData = [];
    for (let j = 0; j < variantCount; j++) {
      const variantStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
      variantsData.push({
        variantName: `Variant #${j + 1}`,
        price: faker.number.int({ min: 50, max: 3000 }),
        stock: faker.number.int({ min: 0, max: 100 }),
        imageUrl: "http://localhost:8080/test_variant.jpeg",
        status: variantStatus,
      });
    }

    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        brandName: faker.company.name(),
        description: faker.lorem.sentence(),
        imageUrl: "http://localhost:8080/test_product.jpeg",
        category: randomCategoryList,
        status: randomStatus,
        variants: {
          create: variantsData,
        },
      },
    });
  }

  console.log("✅ Product seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
