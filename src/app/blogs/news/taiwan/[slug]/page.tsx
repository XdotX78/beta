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
    const postsDirectory = path.join(process.cwd(), 'src/app/blogs/news/taiwan/posts');
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        title: data.title || '',
        excerpt: data.excerpt || '',
        imageUrl: data.imageUrl || '',
        category: data.category || '',
        author: data.author || '',
        date: data.date || '',
        readTime: data.readTime || '',
        location: data.location,
        featured: data.featured || false,
        tags: data.tags || [],
        content
    } as Post & { content: string };
}

export async function generateStaticParams() {
    const postsDirectory = path.join(process.cwd(), 'src/app/blogs/news/taiwan/posts');

    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const files = fs.readdirSync(postsDirectory);
    return files
        .filter(filename => filename.endsWith('.mdx'))
        .map(filename => ({
            slug: filename.replace('.mdx', ''),
        }));
}

export default async function Post({ params }: PageProps) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="max-w-4xl mx-auto px-4 py-12">
            <header className="mb-8">
                <div className="flex items-center text-sm text-gray-600 mb-4">
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
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <p className="text-xl text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center">
                    <span className="text-sm text-gray-600">By {post.author}</span>
                </div>
            </header>

            <div className="prose prose-lg max-w-none">
                <MDXRemote source={post.content} />
            </div>

            {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">Related Topics</h2>
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
} 