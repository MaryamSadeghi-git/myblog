// components/LikeButton.tsx
'use client';

import { useEffect, useState } from 'react';

function getVisitorId(): string {
  let id = localStorage.getItem('visitorId');
  if (!id) {
id = crypto.randomUUID();
localStorage.setItem('visitorId', id);
  }
  return id;
}

export default function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
setLiked(!!localStorage.getItem(`liked:${slug}`));
fetch(`/api/posts/${slug}/like`)
.then((r) => r.json())
.then((d) => setCount(d.count ?? 0));
  }, [slug]);

  const handleLike = async () => {
if (liked) return;
const res = await fetch(`/api/posts/${slug}/like`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ visitorId: getVisitorId() }),
});
if (res.ok) {
setLiked(true);
setCount((c) => c + 1);
localStorage.setItem(`liked:${slug}`, '1');
}
  };

  return (
<button
onClick={handleLike}
disabled={liked}
className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition font-medium ${
liked
? 'bg-cyan-950/50 border-cyan-600 text-cyan-300'
: 'bg-[#0d121e] border-slate-800 text-slate-300 hover:border-cyan-500/50'
}`}
>
<span>{liked ? '❤️' : '🤍'}</span>
<span>{liked ? 'پسندیدید' : 'پسندیدم'}</span>
<span className="text-sm text-slate-400">({count})</span>
</button>
  );
}

