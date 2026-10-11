// components/TopPosts.tsx
import { Link } from '@/i18n/navigation';
import { getTopPosts } from '@/lib/posts';

export default async function TopPosts() {
  const posts = await getTopPosts();

  return (
    <section className="mt-8 p-6 sm:p-8 rounded-3xl bg-bg-card border border-border-subtle shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold text-text-main mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-accent-orange rounded-full"></span>
        پست‌های پرطرفدار
      </h2>

      <div className="space-y-3">
        {posts.map((post: any, index: number) => {
          // استخراج مستقیم likeCount که از lib/posts.ts ارسال می‌شود
          const likesCount = Number(post.likeCount ?? post.likes ?? post.like_count ?? 0);

          return (
            <Link 
              key={post.slug} 
              href={`/posts/${post.slug}`}
              className="group flex items-center justify-between p-3.5 rounded-2xl bg-bg-main/60 hover:bg-accent-orange/10 border border-border-subtle hover:border-accent-orange/40 transition-all duration-200"
            >
              {/* عنوان و آمار */}
              <div className="flex flex-col gap-1.5 pr-2">
                <h3 className="text-sm font-semibold text-text-main group-hover:text-accent-orange transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <span className="text-[11px] text-accent-orange font-medium flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.926 18H17a1 1 0 001-1v-4a1 1 0 00-1-1h-2.25c-.29 0-.573-.045-.838-.13l-.044-.015a2 2 0 01-1.332-1.333c0-.047.01-.093.018-.14l.058-.277a2.5 2.5 0 00-2.483-2.946l-.375-.018a1 1 0 00-.973.968l-.008.064c-.01.076-.017.153-.023.23l-.014.157c-.01.127-.019.255-.028.384-.047.662-.128 1.25-.24 1.758-.028.125-.062.247-.1.365z" />
                  </svg>
                  {likesCount} لایک
                </span>
              </div>

              {/* شماره رتبه */}
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-border-subtle/40 text-text-muted font-bold text-sm font-mono group-hover:bg-accent-orange group-hover:text-white transition-colors">
                {index + 1}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
