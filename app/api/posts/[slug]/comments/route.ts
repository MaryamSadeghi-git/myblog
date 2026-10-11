// app/api/posts/[slug]/comments/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const { slug } = await params;

    // با یک LEFT JOIN ساده، متن و نام کاربری کامنت والد را هم استخراج می‌کنیم
    const [rows]: any = await db.query(
      `SELECT 
        c.id, 
        c.postSlug, 
        c.author, 
        c.content, 
        c.parentId, 
        c.createdAt,
        p.author AS parentAuthor,
        p.content AS parentContent
      FROM comments c
      LEFT JOIN comments p ON c.parentId = p.id
      WHERE c.postSlug = ?
      ORDER BY c.createdAt ASC`,
      [slug]
    );

    // ارسال مستقیم لیست تخت تمام کامنت‌ها (اصلی و پاسخ‌ها)
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { author, content, parentId } = body;

    if (!author || !content) {
      return NextResponse.json(
        { error: 'نام و متن دیدگاه الزامی است.' },
        { status: 400 }
      );
    }
    const [result]: any = await db.execute(
      'INSERT INTO comments (postSlug, author, content, parentId) VALUES (?, ?, ?, ?)',
      [slug, author, content, parentId || null]
    );

    const newComment = {
      id: result.insertId,
      postSlug: slug,
      author,
      content,
      parentId: parentId || null,
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت دیدگاه در دیتابیس' },
      { status: 500 }
    );
  }
}
