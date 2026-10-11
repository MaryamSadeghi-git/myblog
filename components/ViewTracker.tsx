// components/ViewTracker.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function ViewTracker({ slug }: { slug: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    // جلوگیری از ثبت دوبار پشت سر هم در حالت Development (React StrictMode)
    if (tracked.current) return;
    tracked.current = true;

    // ارسال درخواست ثبت بازدید
    fetch(`/api/posts/${slug}/view`, {
      method: 'POST',
    }).catch((err) => console.error('Failed to track view', err));
  }, [slug]);

  return null; // این کامپوننت چیزی رندر نمی‌کند و مخفی است
}
