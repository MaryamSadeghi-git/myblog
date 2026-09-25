import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PostsListPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">همه مقالات وبلاگ</h1>

      {posts.length === 0 ? (
        <p>هنوز مقاله‌ای منتشر نشده است.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="p-4 border rounded-lg hover:shadow-md transition">
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                  {post.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                تاریخ انتشار: {new Date(post.createdAt).toLocaleDateString("fa-IR")}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
