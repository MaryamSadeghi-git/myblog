import { notFound } from 'next/navigation';
import { reader } from '@/lib/keystatic-reader'; // یا مسیر فایل ریدر خودتان
import LikeButton from '@/components/LikeButton';
import Comments from '@/components/Comments';
import MarkdownRenderer from '@/components/MarkdownRenderer'; // کامپوننت رندر مارک‌داون/MDX

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function PostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // ۱. خواندن مقاله از Keystatic
  const post = await reader.collections.posts.read(slug);

  if (!post) {
    notFound();
  }

  // ۲. خواندن محتوای خام MDX/Markdown
  const content = await post.content();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10" dir="rtl">
      {/* عنوان مقاله */}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      {/* تاریخ یا توضیحات کوتاه */}
      {post.date && (
        <p className="text-gray-400 text-sm mb-6">{post.date}</p>
      )}

      {/* تصویر شاخص (در صورت وجود) */}
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-auto rounded-xl mb-8 object-cover"
        />
      )}

      {/* بخش رندر محتوای اصلی مقاله */}
      <article className="prose prose-invert max-w-none mb-12">
        <MarkdownRenderer content={content} />
      </article>

      {/* دکمه لایک */}
      <div className="my-8">
        <LikeButton slug={slug} />
      </div>

      <hr className="border-gray-700 my-8" />

      {/* بخش نظرات */}
      <Comments slug={slug} />
    </main>
  );
}
