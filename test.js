const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // ۱. تعداد فعلی رکوردها
  const count = await prisma.post.count();
  console.log("تعداد رکوردها:", count);

  // ۲. لیست کامل همه
  const all = await prisma.post.findMany();
  console.log("لیست کامل:", JSON.stringify(all, null, 2));
}

main()
  .finally(async () => await prisma.$disconnect());
