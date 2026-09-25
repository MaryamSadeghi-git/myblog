// app/posts/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { prisma } from "@/lib/prisma"; // <--- این خط اضافه شد

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  // خواندن مقاله از دیتابیس با Prisma
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto bg-[#0d121e]/90 p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md">
      {/* Article Header */}
      <header className="mb-10 pb-8 border-b border-slate-800/80">
        <Link
          href="/posts"
          className="text-xs font-semibold text-cyan-400/80 hover:text-cyan-300 transition inline-block mb-5"
        >
          ← بازگشت به لیست مقالات
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/40">
            {post.slug}
          </span>
          {post.createdAt && (
            <>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString("fa-IR")}</span>
            </>
          )}
        </div>
      </header>

      {/* Article Content */}
      <div className="text-slate-200 leading-8 space-y-4">
        <MarkdownRenderer content={post.content} />
      </div>
    </article>
  );
}

