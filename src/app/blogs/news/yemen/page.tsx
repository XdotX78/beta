import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import YemenContent from "./YemenContent";
import type { Post } from "./types";

// Function to get all posts
async function getPosts(): Promise<Post[]> {
    const postsDirectory = path.join(process.cwd(), "src/app/blogs/news/yemen/posts");

    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const files = fs.readdirSync(postsDirectory);
    const posts = files
        .filter(file => file.endsWith(".mdx"))
        .map(file => {
            const filePath = path.join(postsDirectory, file);
            const fileContents = fs.readFileSync(filePath, "utf8");
            const { data } = matter(fileContents);

            return {
                slug: file.replace(".mdx", ""),
                title: data.title,
                excerpt: data.excerpt,
                imageUrl: data.imageUrl,
                category: data.category,
                author: data.author,
                date: data.date,
                readTime: data.readTime,
                location: data.location,
                featured: data.featured || false,
                tags: data.tags || []
            } as Post;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

export default async function YemenSituationPage() {
    const posts = await getPosts();

    if (!posts.length) {
        notFound();
    }

    return <YemenContent initialPosts={posts} />;
} 