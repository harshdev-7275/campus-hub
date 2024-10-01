import {  PrismaClient } from "@prisma/client";
// Assuming colleges data is in a separate file
//@ts-ignore
import { colleges } from "../data/colleges.js";

const prisma = new PrismaClient();

async function main() {
  for (const college of colleges) {
    await prisma.college.upsert({
      where: { name: college.name },
      update: {}, // If you want to update existing records, provide the fields here
      create: {
        name: college.name,
        type: college.type,
        location: college.location,
      },
    });
  }
}

main()
  .then(() => {
    console.log("Data seeded successfully");
  })
  .catch((e) => {
    console.error("Error seeding data:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
