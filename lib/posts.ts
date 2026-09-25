// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

