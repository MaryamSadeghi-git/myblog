// app/api/posts/[slug]/like/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db'; // اتصال به MySQL با mysql2
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

// متد GET: دریافت وضعیت لایک و تعداد کل لایک‌ها
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const { slug } = await params;
    const cookieStore = await cookies();
    const visitorId = cookieStore.get('visitorId')?.value;

    // ۱. شمارش کل لایک‌های این پست
    const [countRows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM likes WHERE postSlug = ?',
      [slug]
    );
    const count = countRows[0]?.total || 0;

    // ۲. بررسی اینکه این کاربر قبلاً لایک کرده یا نه
    let isLiked = false;
    if (visitorId) {
      const [userLikes] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM likes WHERE postSlug = ? AND visitorId = ? LIMIT 1',
        [slug, visitorId]
      );
      isLiked = userLikes.length > 0;
    }

    return NextResponse.json({ count, isLiked });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// متد POST: لایک / آن‌لایک (Toggle)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const { slug } = await params;
    const cookieStore = await cookies();
    let visitorId = cookieStore.get('visitorId')?.value;

    // اگر کاربر بار اولش بود، کوکی جدید برایش می‌سازیم
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      cookieStore.set('visitorId', visitorId, {
        httpOnly: true, // غیرقابل دسترسی با جاوااسکریپت فرانت‌اند (امنیت بالا)
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // انقضا برای ۱ سال
      });
    }

    // ۱. بررسی لایک بودن
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM likes WHERE postSlug = ? AND visitorId = ?',
      [slug, visitorId]
    );

    let isLiked = false;

    if (existing.length > 0) {
      // اگر قبلاً لایک کرده -> حذف لایک (Unlike)
      await pool.query<ResultSetHeader>(
        'DELETE FROM likes WHERE postSlug = ? AND visitorId = ?',
        [slug, visitorId]
      );
      isLiked = false;
    } else {
      // اگر لایک نکرده -> ثبت لایک جدید
      await pool.query<ResultSetHeader>(
        'INSERT INTO likes (postSlug, visitorId) VALUES (?, ?)',
        [slug, visitorId]
      );
      isLiked = true;
    }

    // ۲. دریافت تعداد جدید لایک‌ها
    const [countRows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM likes WHERE postSlug = ?',
      [slug]
    );
    const count = countRows[0]?.total || 0;

    return NextResponse.json({ count, isLiked });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

