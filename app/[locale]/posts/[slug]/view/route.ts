// app/api/posts/[slug]/view/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // ثبت یا افزایش ۱ واحدی تعداد بازدید در MySQL
    await db.query(
      `INSERT INTO views (postSlug, viewCount) 
       VALUES (?, 1) 
       ON DUPLICATE KEY UPDATE viewCount = viewCount + 1`,
      [slug]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
