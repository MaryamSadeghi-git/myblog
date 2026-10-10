// app/api/posts/[slug]/comments/route.ts
import { NextResponse } from 'next/server';
import  db  from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const { slug } = await params;
    const [rows]:any = await db.query(
      'select id,postSlug, author , content, parentId, createdAt FROM comments WHERE postSlug = ? ORDER BY createdAt ASC',
      [slug]
    );
    const commentMap = new Map();
    const treeComments : any[] = [];

    rows.forEach((comment:any) => {
      commentMap.set(comment.id,{...comment , replies:[]})
    });

    rows.forEach((comment:any)=>{
      if(comment.parentId){
        const parent = commentMap.get(comment.parentId);
        if(parent){
          parent.replies.push(commentMap.get(comment.id))
        }
      }else{
        treeComments.push(commentMap.get(comment.id));
      }
    })
    return NextResponse.json(treeComments);
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
    const { author, content ,parentId} = body;

    if (!author || !content) {
      return NextResponse.json(
        { error: 'نام و متن دیدگاه الزامی است.' },
        { status: 400 }
      );
    }
    const [result]: any = await db.execute(
      'INSERT INTO comments (postSlug, author,content,parentId) values (?,?,?,?)',
      [slug, author, content, parentId || null]
    );
  const newComment = {
    id : result.insertId,
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
