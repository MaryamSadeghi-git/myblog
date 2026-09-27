// app/api/posts/[slug]/comments/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const { slug } = await params;
    const comments = await prisma.comment.findMany({
      where: { postSlug: slug },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(comments);
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
    const { author, content } = body;

    if (!author || !content) {
      return NextResponse.json(
        { error: 'نام و متن دیدگاه الزامی است.' },
        { status: 400 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        postSlug: slug,
        author: author,
        content: content,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت دیدگاه در دیتابیس' },
      { status: 500 }
    );
  }
}
