import { notFound } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
import matter from 'gray-matter';
import path from 'path';
import { readFile } from 'fs/promises';
import MdxRenderer from '@/app/components/MdxRenderer';

interface PostFrontmatter {
    title: string;
    date: string;
    author: string;
    description?: string;
    tags?: string[];
    imageUrl?: string;
    featured?: boolean;
    authorTitle?: string;
    authorBio?: string;
    authorImageUrl?: string;
    readTime?: string;
}

async function getPostData(slug: string) {
    try {
        const postsDirectory = path.join(process.cwd(), 'src/app/blogs/news');
        const fullPath = path.join(postsDirectory, `${slug}.mdx`);

        const fileContents = await readFile(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const mdxSource = await serialize(content);

        return {
            frontmatter: data as PostFrontmatter,
            source: mdxSource
        };
    } catch (error) {
        return null;
    }
}

export default async function NewsPostPage({ params }: { params: { slug: string } }) {
    const post = await getPostData(params.slug);

    if (!post) {
        notFound();
    }

    const { frontmatter, source } = post;

    return (
        <article className="max-w-4xl mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>
                <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        {frontmatter.authorImageUrl && (
                            <img
                                src={frontmatter.authorImageUrl}
                                alt={frontmatter.author}
                                className="w-10 h-10 rounded-full"
                            />
                        )}
                        <div>
                            <p className="font-medium">{frontmatter.author}</p>
                            {frontmatter.authorTitle && (
                                <p className="text-sm">{frontmatter.authorTitle}</p>
                            )}
                        </div>
                    </div>
                    <div className="text-sm">
                        <time dateTime={frontmatter.date}>
                            {new Date(frontmatter.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                        {frontmatter.readTime && (
                            <span className="ml-4">{frontmatter.readTime} read</span>
                        )}
                    </div>
                </div>
            </header>
            <MdxRenderer source={source} />
        </article>
    );
} 