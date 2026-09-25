const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.create({
    data: {
      title: "اولین مقاله من",
      slug: "first_post",
      content: "# به وبلاگ من خوش آمدید!\n\nاین اولین مقاله من با **Next.js** و **Markdown** است.\n\n- قابلیت ۱\n- قابلیت ۲",
    },
  });
  console.log("SUCCESS:", post.title);
}

main()
  .catch((e) => console.error("ERROR:", e))
  .finally(async () => await prisma.$disconnect());
