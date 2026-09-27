// app/posts/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { reader } from '@/lib/keystatic-reader'; // یا هر مسیری که reader داری

export default async function PostsPage() {
  const posts = await reader.collections.posts.all();

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-right">تمام مقالات وبلاگ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col"
          >
            {/* 👇 نمایش تصویر مقاله اگر وجود داشته باشد */}
            {post.entry.coverImage ? (
              <div className="relative w-full h-48 bg-gray-100">
                <img
                  src={post.entry.coverImage}
                  alt={post.entry.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              // در صورت نداشتن عکس، یک کادر خاکستری یا پیش‌فرض
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                بدون تصویر
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between text-right">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {post.entry.title}
                </h2>
                {post.entry.description && (
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {post.entry.description}
                  </p>
                )}
              </div>

              <Link
                href={`/posts/${post.slug}`}
                className="text-blue-600 font-medium hover:underline text-sm mt-2 inline-block"
              >
                ادامه مطلب ←
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
