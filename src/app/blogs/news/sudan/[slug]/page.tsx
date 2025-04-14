import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Post, PostMetadata } from '../types';

interface PageProps {
    params: {
        slug: string;
    };
}

async function getPost(slug: string): Promise<Post | null> {
    const postsDirectory = path.join(process.cwd(), 'src/app/blogs/news/sudan/posts');
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);

    try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        const metadata: PostMetadata = {
            slug,
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

        return {
            metadata,
            content,
        };
    } catch (error) {
        return null;
    }
}

export async function generateStaticParams() {
    const postsDirectory = path.join(process.cwd(), 'src/app/blogs/news/sudan/posts');
    const files = fs.readdirSync(postsDirectory);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    return mdxFiles.map(file => ({
        slug: file.replace(/\.mdx$/, ''),
    }));
}

export default async function Post({ params }: PageProps) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="max-w-4xl mx-auto py-8 px-4">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{post.metadata.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                    <span>{post.metadata.author}</span>
                    <span>•</span>
                    <span>{post.metadata.date}</span>
                    <span>•</span>
                    <span>{post.metadata.readTime}</span>
                    {post.metadata.location && (
                        <>
                            <span>•</span>
                            <span>{post.metadata.location}</span>
                        </>
                    )}
                </div>
                {post.metadata.tags && (
                    <div className="mt-4 flex gap-2">
                        {post.metadata.tags.map(tag => (
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