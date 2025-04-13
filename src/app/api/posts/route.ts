import { readdir, readFile } from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';

async function getAllMdxFiles(directory: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            return getAllMdxFiles(fullPath);
        } else if (entry.name.endsWith('.mdx')) {
            return [fullPath];
        }
        return [];
    }));
    return files.flat();
}

export async function GET() {
    try {
        const postsDirectory = path.join(process.cwd(), 'src/app/blogs/news');
        const mdxFiles = await getAllMdxFiles(postsDirectory);

        const posts = await Promise.all(mdxFiles.map(async (filePath) => {
            const fileContents = await readFile(filePath, 'utf8');
            const { data } = matter(fileContents);
            const relativePath = path.relative(postsDirectory, filePath);
            const slug = relativePath.replace(/\.mdx$/, '').replace(/\\/g, '/');

            return {
                slug,
                title: data.title,
                excerpt: data.description || "",
                imageUrl: data.imageUrl || "/images/blog/default.jpg",
                category: data.category || "uncategorized",
                subcategory: data.subcategory,
                author: data.author,
                date: data.date,
                readTime: data.readTime || "5 min read",
                featured: data.featured || false,
                subBlog: data.subBlog,
            };
        }));

        const sortedPosts = posts.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        return NextResponse.json(sortedPosts);
    } catch (error) {
        console.error('Error reading posts:', error);
        return NextResponse.json([], { status: 500 });
    }
} 