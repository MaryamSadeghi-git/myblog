// app/api/posts/[slug]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// تعداد لایک‌ها
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const count = await prisma.like.count({ where: { postSlug: slug } });
  return NextResponse.json({ count });
}

// ثبت لایک
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
const { slug } = await params;
const { visitorId } = await req.json();

if (!visitorId) {
return NextResponse.json({ error: 'visitorId الزامی است' }, { status: 400 });
}

const like = await prisma.like.create({
data: { postSlug: slug, visitorId },
});

return NextResponse.json({ success: true, like });
  } catch (error: any) {
// خطای unique یعنی قبلاً لایک کرده
if (error.code === 'P2002') {
return NextResponse.json({ error: 'قبلاً لایک کرده‌اید' }, { status: 409 });
}
console.error('Like Error:', error);
return NextResponse.json({ error: 'خطا در ثبت لایک' }, { status: 500 });
  }
}
