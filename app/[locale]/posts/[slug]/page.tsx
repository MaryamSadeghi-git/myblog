// app/[locale]/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { reader } from '@/lib/keystatic-reader';
import LikeButton from '@/components/LikeButton';
import Comments from '@/components/Comments';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { faToEn } from '@/lib/translate';
import { Link } from '@/i18n/navigation';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { slug, locale } = await params;

  const post = await reader.collections.posts.read(slug);
  if (!post) notFound();

  const isEn = locale === 'en';
  const isFa = locale === 'fa';

  const title = isEn ? await faToEn(post.title) : post.title;

  const raw = await post.content();
  if (typeof raw !== 'string') {
    throw new Error(
      `Keystatic post.content() must return a string, but got: ${Object.prototype.toString.call(raw)}`
    );
  }

  const content = isEn ? await faToEn(raw) : raw;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* دکمه بازگشت */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-text-muted hover:text-accent-orange text-sm font-semibold inline-flex items-center gap-2 transition-colors"
        >
          <span>{isFa ? '→ بازگشت به صفحه اصلی' : '← Back to Home'}</span>
        </Link>
      </div>

      {/* کارت اصلی مقاله با کادر کامل */}
      <div className="bg-bg-card border border-border-subtle rounded-3xl p-6 sm:p-10 shadow-sm mb-10">
        {/* هدر پست */}
        <header dir={isEn ? 'ltr' : 'rtl'} className={`${isEn ? 'text-left' : 'text-right'} mb-8`}>
          <div className="inline-block w-8 h-1 bg-accent-orange rounded-full mb-4" />

          <h1 className="text-3xl sm:text-5xl font-black text-text-main leading-tight mb-4">
            {title}
          </h1>

          {post.date ? (
            <p className="text-text-muted text-sm flex items-center gap-2 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-accent-orange" />
              {post.date}
            </p>
          ) : null}
        </header>

        {/* تصویر شاخص درون کارت */}
        {post.coverImage ? (
          <div className="rounded-2xl overflow-hidden mb-10 border border-border-subtle">
            <img
              src={post.coverImage}
              alt={title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        ) : null}

        {/* محتوای مقاله */}
        <article
          dir={isEn ? 'ltr' : 'rtl'}
          className={`w-full text-text-main/90 leading-8 ${
            isEn ? 'text-left' : 'text-right'
          }`}
        >
          <MarkdownRenderer content={content} />
        </article>
      </div>

      {/* بخش لایک */}
      <div className="my-8 flex items-center justify-center p-4 rounded-2xl bg-bg-card border border-border-subtle shadow-sm">
        <LikeButton slug={slug} />
      </div>

      {/* بخش نظرات */}
      <div className="rounded-3xl bg-bg-card border border-border-subtle shadow-sm p-6 sm:p-8">
        <Comments slug={slug} />
      </div>
    </main>
  );
}
