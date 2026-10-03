// app/[locale]/archive/page.tsx
import { reader } from '@/lib/keystatic-reader';
import { Link } from '@/i18n/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ArchivePage({ params }: PageProps) {
  const { locale } = await params;
  const posts = await reader.collections.posts.all();

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">
      <div className="border-b border-border-subtle pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent-orange/10 text-accent-orange border border-accent-orange/20 inline-block mb-2">
            {locale === 'fa' ? 'تمام مقالات' : 'All Posts'}
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {locale === 'fa' ? 'آرشیو مطالب' : 'Archive'}
          </h1>
        </div>

        <Link
          href="/"
          className="text-sm text-text-muted hover:text-accent-orange transition-colors"
        >
          {locale === 'fa' ? 'بازگشت به خانه' : 'Back to Home'}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-2xl overflow-hidden bg-bg-card border border-border-subtle hover:border-accent-orange/40 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-accent-orange/5 hover:-translate-y-1"
          >
            {post.entry.coverImage ? (
              <div className="relative w-full h-48 bg-bg-main overflow-hidden">
                <img
                  src={post.entry.coverImage}
                  alt={post.entry.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : null}

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-text-main group-hover:text-accent-orange transition-colors duration-200 line-clamp-2 mb-2">
                  <Link href={`/posts/${post.slug}`}>{post.entry.title}</Link>
                </h2>

                {post.entry.description ? (
                  <p className="text-text-muted text-sm line-clamp-3 leading-relaxed mb-4">
                    {post.entry.description}
                  </p>
                ) : null}
              </div>

              <div className="pt-3 border-t border-border-subtle mt-auto">
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-accent-orange hover:text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors"
                >
                  {locale === 'fa' ? 'مطالعه مقاله' : 'Read'}
                  <span className="opacity-80">{locale === 'fa' ? '←' : '→'}</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
