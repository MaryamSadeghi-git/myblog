import { getPopularPosts } from '@/lib/posts';
import { Link } from '@/i18n/navigation';

export default async function PopularPage() {
  const popularPosts = await getPopularPosts();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">پربازدیدترین مقالات</h1>
        <p className="text-sm text-text-muted mt-1">مقایسه بر اساس بیشترین بازدید و کلیک</p>
      </div>

      <div className="space-y-4">
        {popularPosts.length === 0 ? (
          <p className="text-text-muted text-sm">هنوز مقاله‌ای بازدید نشده است.</p>
        ) : (
          popularPosts.map((post: any) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group flex items-center justify-between p-4 rounded-2xl bg-bg-card border border-border-subtle hover:border-accent-orange transition-all shadow-sm"
            >
              <div>
                <h2 className="text-base font-semibold text-text-main group-hover:text-accent-orange transition-colors">
                  {post.title}
                </h2>
                <span className="text-xs text-text-muted mt-1 block">{post.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-accent-orange bg-accent-orange/10 px-3 py-1.5 rounded-xl">
                <span>{post.viewCount} بازدید</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
