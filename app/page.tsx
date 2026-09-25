// app/posts/page.tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function PostsListPage() {
  const posts = getAllPosts(); // خواندن مستقیم از فایل‌های سیستم

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">همه مقالات وبلاگ</h1>

      {posts.length === 0 ? (
        <p className="text-gray-400">هنوز مقاله‌ای داخل پوشه content/posts ثبت نشده است.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.slug} className="p-4 border border-slate-800 rounded-lg hover:border-slate-700 bg-slate-900/50 transition">
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-xl font-semibold text-cyan-400 hover:underline">
                  {post.title}
                </h2>
              </Link>
              {post.date && (
                <p className="text-sm text-gray-500 mt-1">
                  تاریخ: {post.date}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
