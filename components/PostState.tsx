// components/PostStats.tsx
import 'server-only';

async function getBaseUrl() {
  // بهترین حالت: در env ست کنید
  // NEXT_PUBLIC_SITE_URL=http://localhost:3000
  // NEXT_PUBLIC_SITE_URL=https://yourdomain.com
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');

  // fallback (در بعضی محیط‌ها ممکنه درست کار نکنه)
  return 'http://localhost:3000';
}

async function fetchLikes(slug: string) {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/posts/${slug}/like`, {
    // چون لایک/کامنت دیتابیس‌اند، معمولاً بهتره کش نشه
    cache: 'no-store',
  });
  if (!res.ok) return { likes: 0 };
  const data = await res.json();
  return { likes: Number(data.likes ?? 0) };
}

async function fetchCommentsCount(slug: string) {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/posts/${slug}/comments`, {
    cache: 'no-store',
  });
  if (!res.ok) return { commentsCount: 0 };

  const data = await res.json();
  const commentsCount = Array.isArray(data) ? data.length : 0;
  return { commentsCount };
}

export default async function PostStats({ slug }: { slug: string }) {
  const [{ likes }, { commentsCount }] = await Promise.all([
    fetchLikes(slug),
    fetchCommentsCount(slug),
  ]);

  return (
    <span className="inline-flex items-center gap-3 text-xs text-text-muted">
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden>♥</span>
        <span>{likes}</span>
      </span>

      <span className="opacity-40">•</span>

      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden>💬</span>
        <span>{commentsCount}</span>
      </span>
    </span>
  );
}
