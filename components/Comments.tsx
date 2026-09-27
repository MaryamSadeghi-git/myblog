// components/Comments.tsx

'use client';

import { useState, useEffect } from 'react';

interface CommentItem {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // دریافت لیست کامنت‌ها
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${slug}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (slug) fetchComments();
  }, [slug]);

  // ثبت کامنت جدید
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'خطایی در ثبت دیدگاه رخ داد.');
      }

      setAuthor('');
      setContent('');
      await fetchComments(); // رفرش لیست دیدگاه‌ها
    } catch (err: any) {
      setErrorMsg(err.message || 'خطایی در ثبت دیدگاه رخ داد. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4">دیدگاه‌ها ({comments.length})</h3>

      {/* فرم ارسال دیدگاه */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8">
        <input
          type="text"
          placeholder="نام شما"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="p-2.5 rounded bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-blue-500"
        />
        <textarea
          placeholder="متن نظر شما..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
          className="p-2.5 rounded bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-blue-500"
        />
        {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
        <button
          type="submit"
          disabled={loading}
          className="self-start px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition disabled:opacity-50"
        >
          {loading ? 'در حال ارسال...' : 'ارسال دیدگاه'}
        </button>
      </form>

      {/* لیست دیدگاه‌ها */}
      <div className="flex flex-col gap-4">
        {comments.length === 0 ? (
          <p className="text-zinc-500 text-sm">هنوز دیدگاهی ثبت نشده است.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-zinc-200">{c.author}</span>
                <span className="text-xs text-zinc-500">
                  {new Date(c.createdAt).toLocaleDateString('fa-IR')}
                </span>
              </div>
              <p className="text-zinc-300 text-sm whitespace-pre-wrap">{c.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
