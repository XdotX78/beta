import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaMap, FaHistory, FaTag, FaHandsHelping, FaGlobe } from "react-icons/fa";
import TaiwanSituationContent from './TaiwanSituationContent';
import type { Post } from './types';

// Function to get all posts
async function getPosts(): Promise<Post[]> {
    const postsDirectory = path.join(process.cwd(), "src/app/blogs/news/taiwan/posts");

    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

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
                readTime: typeof data.readTime === 'string' ? parseInt(data.readTime, 10) : data.readTime,
                location: data.location,
                featured: data.featured,
                tags: data.tags,
            };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

export default async function TaiwanSituationPage() {
    const posts = await getPosts();
    const featuredPosts = posts.filter(post => post.featured);

    if (!posts) {
        notFound();
    }

    return <TaiwanSituationContent posts={posts} featuredPosts={featuredPosts} />;
} 