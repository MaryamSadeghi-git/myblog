// components/Comments.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  parentId?: number | null;
  parentAuthor?: string | null;
  parentContent?: string | null;
}

export default function Comments({ slug }: { slug: string }) {
  const tPost = useTranslations('Post');
  const tForm = useTranslations('CommentForm');

  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [replyingTo, setReplyingTo] = useState<{ id: number; author: string; content: string } | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${slug}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: author.trim(),
          content: content.trim(),
          parentId: replyingTo ? replyingTo.id : null,
        }),
      });

      if (res.ok) {
        await fetchComments();
        setContent('');
        setReplyingTo(null);
      } else {
        setErrorMsg(tForm('errorSubmit'));
      }
    } catch {
      setErrorMsg(tForm('errorNetwork'));
    } finally {
      setLoading(false);
    }
  };

  const scrollToOriginalComment = (targetId: number) => {
    const el = document.getElementById(`comment-${targetId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedId(targetId);
      setTimeout(() => setHighlightedId(null), 2500);
    }
  };

  const handleReplyBtnClick = (item: Comment) => {
    setReplyingTo({ id: item.id, author: item.author, content: item.content });
    const formElement = document.getElementById('comment-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.getElementById('comment-textarea')?.focus();
    }
  };

  return (
    <section className="mt-14 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      {/* هدر بخش دیدگاه‌ها */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
          <span>{tPost('comments')}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-300 dark:bg-orange-950/70 dark:text-orange-400 dark:border-orange-500/40 font-semibold">
            {comments.length}
          </span>
        </h3>
      </div>

      {/* فرم ارسال نظر یا پاسخ */}
      <form
        id="comment-form"
        onSubmit={handleSubmit}
        className="mb-10 p-5 rounded-2xl bg-zinc-50 border border-zinc-200 dark:bg-black dark:border-zinc-800 shadow-sm space-y-4"
      >
        {/* باکس نشانگر حالت پاسخ (Reply) */}
        {replyingTo && (
          <div className="flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl bg-zinc-100 border border-zinc-300 text-zinc-800 dark:bg-zinc-950 dark:border-orange-500/40 dark:text-orange-300 animate-in fade-in duration-200">
            <div className="flex flex-col gap-0.5 max-w-[85%]">
              <span className="font-semibold flex items-center gap-1">
                <span className="text-zinc-500 dark:text-orange-400">↩ پاسخ به</span>
                <strong className="text-zinc-900 dark:text-orange-300 underline decoration-zinc-400 dark:decoration-orange-500">
                  @{replyingTo.author}
                </strong>
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                {replyingTo.content}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors px-1 text-sm"
              title="انصراف"
            >
              ✕
            </button>
          </div>
        )}

        <div className="space-y-3">
          <input
            type="text"
            placeholder={tForm('namePlaceholder')}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/40 focus:border-zinc-500 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-orange-500/30 dark:focus:border-orange-500 text-sm transition-all"
            required
          />

          <textarea
            id="comment-textarea"
            rows={3}
            placeholder={replyingTo ? `پاسخ به ${replyingTo.author}...` : tForm('commentPlaceholder')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/40 focus:border-zinc-500 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-orange-500/30 dark:focus:border-orange-500 text-sm transition-all resize-y min-h-[90px]"
            required
          />
        </div>

        {errorMsg && <p className="text-red-500 text-xs font-medium">{errorMsg}</p>}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl font-medium text-sm transition-all active:scale-[0.98] disabled:opacity-50 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-orange-500 dark:text-black dark:font-semibold dark:hover:bg-orange-400 dark:shadow-md dark:shadow-orange-500/20"
          >
            {loading ? tForm('submitting') : replyingTo ? 'ارسال پاسخ' : tForm('submit')}
          </button>
        </div>
      </form>

      {/* لیست دیدگاه‌ها */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 dark:text-zinc-600 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
            <p className="text-sm">{tPost('noComments')}</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isHighlighted = highlightedId === comment.id;

            return (
              <div
                key={comment.id}
                id={`comment-${comment.id}`}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-500 space-y-3 ${
                  isHighlighted
                    ? 'border-zinc-400 bg-zinc-100/80 ring-2 ring-zinc-300 dark:border-orange-500 dark:bg-orange-950/20 dark:ring-2 dark:ring-orange-500/40'
                    : 'bg-white border-zinc-200 dark:bg-black dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {/* بخش مشخصات نویسنده و دکمه پاسخ */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {/* آواتار: در لایت طوسی شیک، در دارک گرادیانت نارنجی پرانرژی */}
                    <div className="w-8 h-8 rounded-full bg-zinc-200 text-zinc-700 font-bold dark:bg-gradient-to-tr dark:from-orange-600 dark:to-amber-500 dark:text-black flex items-center justify-center text-xs select-none">
                      {comment.author?.trim().charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 block">
                        {comment.author}
                      </span>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        {new Date(comment.createdAt).toLocaleDateString('fa-IR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* دکمه پاسخ */}
                  <button
                    type="button"
                    onClick={() => handleReplyBtnClick(comment)}
                    className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-orange-400"
                  >
                    <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    پاسخ
                  </button>
                </div>

                {/* نقل‌قول کامنت والد در ریپلای */}
                {comment.parentId && (
                  <button
                    type="button"
                    onClick={() => scrollToOriginalComment(comment.parentId!)}
                    className="w-full text-right p-2.5 rounded-xl transition-colors flex flex-col gap-0.5 group cursor-pointer bg-zinc-50 border-r-4 border-zinc-400 hover:bg-zinc-100 dark:bg-zinc-950 dark:border-r-4 dark:border-orange-500 dark:hover:bg-zinc-900"
                    title="پرش به نظر اصلی"
                  >
                    <span className="text-xs font-bold text-zinc-700 group-hover:underline dark:text-orange-400 flex items-center gap-1">
                      <span>↩ پاسخ به</span>
                      <span>@{comment.parentAuthor || 'دیدگاه'}</span>
                    </span>
                    {comment.parentContent && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-full">
                        {comment.parentContent}
                      </p>
                    )}
                  </button>
                )}

                {/* متن اصلی دیدگاه */}
                <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-line pr-1">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
