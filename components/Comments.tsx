// components/Comments.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface Comment {
  id: string | number;
  author: string;
  content: string;
  createdAt: string;
  parentId?: string | number | null;
  replies?: Comment[];
}

export default function Comments({ slug }: { slug: string }) {
  const tPost = useTranslations('Post');
  const tForm = useTranslations('CommentForm');

  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ذخیره کامنتی که کاربر قصد پاسخ به آن را دارد
  const [replyingTo, setReplyingTo] = useState<{ id: string | number; author: string } | null>(null);

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
          author,
          content,
          parentId: replyingTo ? replyingTo.id : null, // ارسال شناسه کامنت والد
        }),
      });

      if (res.ok) {
        // بروزرسانی کل لیست کامنت‌ها جهت چیدمان درختی صحیح
        await fetchComments();
        setContent('');
        setReplyingTo(null);
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

      {/* فرم ارسال دیدگاه یا پاسخ */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        {replyingTo && (
          <div className="flex items-center justify-between text-xs sm:text-sm px-3 py-2 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <span>
              پاسخ به: <strong className="font-semibold">{replyingTo.author}</strong>
            </span>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              انصراف
            </button>
          </div>
        )}

        <div>
          <input
            type="text"
            placeholder={tForm('namePlaceholder')}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>
        <div>
          <textarea
            rows={3}
            placeholder={
              replyingTo ? `پاسخ به ${replyingTo.author}...` : tForm('commentPlaceholder')
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? tForm('submitting') : replyingTo ? 'ارسال پاسخ' : tForm('submit')}
        </button>
      </form>

      {/* لیست دیدگاه‌ها */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-zinc-500 text-sm">{tPost('noComments')}</p>
        ) : (
          comments.map((comment) => (
            <CommentItemNode
              key={comment.id}
              comment={comment}
              onReply={(item) => {
                setReplyingTo({ id: item.id, author: item.author });
                window.scrollTo({ top: 300, behavior: 'smooth' }); // اسکرول نرم به سمت فرم در صورت نیاز
              }}
            />
          ))
        )}
      </div>
    </section>
  );
}

// کامپوننت داخلی برای نمایش هر کامنت و پاسخ‌های درختی آن (Recursive)
function CommentItemNode({
  comment,
  onReply,
}: {
  comment: Comment;
  onReply: (item: Comment) => void;
}) {
  return (
    <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-sm">{comment.author}</span>
        <span className="text-xs text-zinc-500">
          {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
        </span>
      </div>

      <p className="text-zinc-700 dark:text-zinc-300 text-sm whitespace-pre-line">
        {comment.content}
      </p>

      {/* دکمه پاسخ */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => onReply(comment)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          پاسخ
        </button>
      </div>

      {/* نمایش پاسخ‌ها با خط حاشیه و فرورفتگی */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 mr-4 sm:mr-6 pr-3 border-r-2 border-zinc-200 dark:border-zinc-700 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItemNode key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}
