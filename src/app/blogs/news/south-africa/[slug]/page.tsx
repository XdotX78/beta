import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Post } from "../types";

async function getPost(slug: string): Promise<Post | null> {
    const postsDirectory = path.join(process.cwd(), "src/app/blogs/news/south-africa/posts");
    const filePath = path.join(postsDirectory, `${slug}.mdx`);

    try {
        const fileContent = await fs.readFile(filePath, "utf8");
        const { data, content } = matter(fileContent);

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
        } as Post;
    } catch (error) {
        console.error("Error reading post:", error);
        return null;
    }
}

export async function generateStaticParams() {
    const postsDirectory = path.join(process.cwd(), "src/app/blogs/news/south-africa/posts");
    const files = await fs.readdir(postsDirectory);

    return files
        .filter(file => file.endsWith(".mdx"))
        .map(file => ({
            slug: file.replace(".mdx", ""),
        }));
}

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function Post({ params }: PageProps) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="max-w-4xl mx-auto px-4 py-12">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center text-gray-600 text-sm mb-4">
                    <span>{post.date}</span>
                    <span className="mx-2">·</span>
                    <span>{post.readTime}</span>
                    {post.location && (
                        <>
                            <span className="mx-2">·</span>
                            <span>{post.location}</span>
                        </>
                    )}
                </div>
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            <div className="prose prose-lg max-w-none">
                {post.content && <MDXRemote source={post.content} />}
            </div>
        </article>
    );
} 