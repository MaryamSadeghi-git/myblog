//app/page.tsx
import Link from 'next/link';
import { reader } from '@/lib/keystatic-reader';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const posts = await reader.collections.posts.all();

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6" dir="rtl">
      <header className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">وبلاگ من</h1>
          <p className="text-sm text-slate-400 mt-1">
            مدیریت محتوا با Keystatic و نظرات با دیتابیس
          </p>
        </div>
        <Link
          href="/posts"
          className="text-sm bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-4 py-2 rounded-xl transition"
        >
          صفحه آرشیو مقالات
        </Link>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {posts.length === 0 ? (
          <div className="col-span-full bg-[#0d121e] border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            هنوز مقاله‌ای منتشر نشده است.
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="flex flex-col bg-[#0d121e] border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition group"
            >
              {/* نمایش عکس در صفحه اصلی */}
              {post.entry.coverImage ? (
                <div className="relative w-full h-48 bg-slate-900">
                  <img
                    src={post.entry.coverImage}
                    alt={post.entry.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-slate-900/60 flex items-center justify-center text-slate-600 text-sm">
                  بدون تصویر
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition line-clamp-1">
                      {post.entry.title}
                    </h2>
                  </div>
                  {post.entry.description && (
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                      {post.entry.description}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                  <span className="text-xs text-slate-500">
                    {post.entry.date
                      ? new Date(post.entry.date).toLocaleDateString('fa-IR')
                      : ''}
                  </span>
                  <span className="text-xs text-cyan-400 font-medium inline-flex items-center gap-1">
                    مشاهده مقاله &larr;
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}
