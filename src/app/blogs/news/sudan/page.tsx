import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import SudanContent from './SudanContent';
import type { Post } from './types';

async function getPosts(): Promise<Post[]> {
    const postsDirectory = path.join(process.cwd(), 'src/app/blogs/news/sudan/posts');
    const fileNames = fs.readdirSync(postsDirectory);

    const posts = fileNames
        .filter(fileName => fileName.endsWith('.mdx'))
        .map(fileName => {
            const slug = fileName.replace(/\.mdx$/, '');
            const filePath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                content,
                title: data.title,
                excerpt: data.excerpt,
                imageUrl: data.imageUrl,
                category: data.category,
                author: data.author,
                date: data.date,
                readTime: data.readTime,
                location: data.location,
                featured: data.featured,
                tags: data.tags,
            };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

export default async function SudanPage() {
    const posts = await getPosts();
    const featuredPosts = posts.filter(post => post.featured);

    return <SudanContent posts={posts} featuredPosts={featuredPosts} />;
} 