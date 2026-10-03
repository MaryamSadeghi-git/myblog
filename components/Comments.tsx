// components/Comments.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export default function Comments({ slug }: { slug: string }) {
  const tPost = useTranslations('Post');
  const tForm = useTranslations('CommentForm');

  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // آدرس دقیق دریافت کامنت‌ها بر اساس ساختار پوشه‌ها
    fetch(`/api/posts/${slug}/comments`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch comments');
        return res.json();
      })
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, [slug]);

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

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setAuthor('');
        setContent('');
      } else {
        setErrorMsg(tForm('errorSubmit'));
      }
    } catch (error) {
      setErrorMsg(tForm('errorNetwork'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      <h3 className="text-xl font-bold mb-6">{tPost('comments')}</h3>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder={tForm('namePlaceholder')}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <textarea
            rows={3}
            placeholder={tForm('commentPlaceholder')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? tForm('submitting') : tForm('submit')}
        </button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-zinc-500 text-sm">{tPost('noComments')}</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">{comment.author}</span>
                <span className="text-xs text-zinc-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 text-sm whitespace-pre-line">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
