import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Post } from '../types';

interface PageProps {
    params: {
        slug: string;
    };
}

async function getPost(slug: string): Promise<Post | null> {
    try {
        const postsDirectory = path.join(process.cwd(), 'src/app/blogs/news/yemen/posts');
        const fullPath = path.join(postsDirectory, `${slug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data: metadata, content } = matter(fileContents);

        return {
            slug,
            title: metadata.title,
            excerpt: metadata.excerpt,
            imageUrl: metadata.imageUrl,
            category: metadata.category,
            author: metadata.author,
            date: metadata.date,
            readTime: metadata.readTime,
            location: metadata.location,
            featured: metadata.featured,
            tags: metadata.tags,
            content
        };
    } catch (error) {
        return null;
    }
}

export async function generateStaticParams() {
    const postsDirectory = path.join(process.cwd(), 'src/app/blogs/news/yemen/posts');
    const files = fs.readdirSync(postsDirectory);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    return mdxFiles.map(file => ({
        slug: file.replace(/\.mdx$/, '')
    }));
}

export default async function Post({ params }: PageProps) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="max-w-4xl mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                    <span>{post.date}</span>
                    <span>By {post.author}</span>
                    <span>{post.readTime} read</span>
                    {post.location && <span>Location: {post.location}</span>}
                </div>
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </header>
            <div className="prose max-w-none">
                <MDXRemote source={post.content} />
            </div>
        </article>
    );
} 