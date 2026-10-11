// app/[locale]/top/page.tsx
import TopPosts from '@/components/TopPosts';
import { useTranslations } from 'next-intl';

export default function TopPostsPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          برترین مقالات
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          محبوب‌ترین مقالات وبلاگ بر اساس تعداد لایک‌ها
        </p>
      </div>

      {/* نمایش لیست مقالات برتر */}
      <TopPosts />
    </main>
  );
}
