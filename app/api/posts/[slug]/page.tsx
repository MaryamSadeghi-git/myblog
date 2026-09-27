import { notFound } from 'next/navigation';
import { reader } from '@/lib/keystatic-reader';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import LikeButton from '@/components/LikeButton';
import Comments from '@/components/Comments';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const post = await reader.collections.posts.read(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const rawContent = await post.content();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {post.title}
        </h1>
        {post.date && (
          <p className="text-sm text-gray-500">
            تاریخ انتشار: {post.date}
          </p>
        )}
      </header>

      {/* نمایش متن مقاله */}
      <article className="prose max-w-none mb-12">
        <MarkdownRenderer content={typeof rawContent === 'string' ? rawContent : ''} />
      </article>

      <hr className="my-8 border-gray-200" />

      {/* بخش تعاملی: لایک و نظرات */}
      <div className="space-y-8">
        <LikeButton slug={resolvedParams.slug} />
        <Comments slug={resolvedParams.slug} />
      </div>
    </main>
  );
}
