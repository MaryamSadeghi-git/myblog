// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import  db from './db'; 
import { unstable_cache } from 'next/cache';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostItem {
  slug: string;
  title: string;
  date: string;
  content: string;
}

// دریافت لیست همه مقالات
export function getAllPosts(): PostItem[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date ? String(data.date) : '',
        content,
      };
    });

  // مرتب‌سازی بر اساس تاریخ (از جدید به قدیم)
  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// دریافت یک مقاله بر اساس slug
export function getPostBySlug(slug: string): PostItem | null {
  try {
    let fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(postsDirectory, `${slug}.mdx`);
    }

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      date: data.date ? String(data.date) : '',
      content,
    };
  } catch {
    return null;
  }
}
//برترین مقالات
// دریافت ۵ مقاله برتر بر اساس بیشترین لایک از دیتابیس و ترکیب با فایل‌های محلی
export async function getTopPosts() {
  try {
    // ۱. گرفتن ۵ اسلاگ برتر بر اساس تعداد لایک از جدول likes
    const [rows]: any = await db.query(`
      SELECT postSlug, COUNT(id) as likeCount 
      FROM likes 
      GROUP BY postSlug 
      ORDER BY likeCount DESC 
      LIMIT 5
    `);

    if (!rows || rows.length === 0) {
      return [];
    }

    // ۲. خواندن اطلاعات هر مقاله از فایل‌های Markdown مربوطه
    const topPosts = rows.map((row: { postSlug: string; likeCount: number }) => {
      const post = getPostBySlug(row.postSlug);
      return {
        slug: row.postSlug,
        title: post ? post.title : row.postSlug,
        date: post ? post.date : '',
        likeCount: row.likeCount,
      };
    });

    return topPosts;
  } catch (error) {
    console.error('Error fetching top posts:', error);
    return [];
  }
}
// دریافت ۵ مقاله پربازدید بر اساس جدول views
export async function getPopularPosts() {
  try {
    const [rows]: any = await db.query(`
      SELECT postSlug, viewCount 
      FROM views 
      ORDER BY viewCount DESC 
      LIMIT 5
    `);

    if (!rows || rows.length === 0) {
      return [];
    }

    const popularPosts = rows.map((row: { postSlug: string; viewCount: number }) => {
      const post = getPostBySlug(row.postSlug);
      return {
        slug: row.postSlug,
        title: post ? post.title : row.postSlug,
        date: post ? post.date : '',
        viewCount: row.viewCount,
      };
    });

    return popularPosts;
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    return [];
  }
}
