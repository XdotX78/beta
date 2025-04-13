import { notFound } from 'next/navigation';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { promises as fs } from 'fs';
import path from 'path';

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function UkraineArticlePage({ params }: PageProps) {
    try {
        const filePath = path.join(process.cwd(), 'src/app/blogs/news/ukraine', `${params.slug}.mdx`);
        const source = await fs.readFile(filePath, 'utf8');
        const { data: frontmatter, content } = matter(source);

        return (
            <article className="max-w-4xl mx-auto px-4 py-12">
                <header className="mb-12">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <time dateTime={frontmatter.date}>{frontmatter.date}</time>
                        <span>•</span>
                        <span>{frontmatter.readTime}</span>
                        {frontmatter.location && (
                            <>
                                <span>•</span>
                                <span>{frontmatter.location}</span>
                            </>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{frontmatter.title}</h1>
                    {frontmatter.description && (
                        <p className="text-xl text-gray-600 mb-6">{frontmatter.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="font-medium">{frontmatter.author}</p>
                            {frontmatter.authorTitle && (
                                <p className="text-sm text-gray-600">{frontmatter.authorTitle}</p>
                            )}
                        </div>
                    </div>
                </header>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <MDXRemote source={content} />
                </div>
            </article>
        );
    } catch (error) {
        console.error('Error loading article:', error);
        notFound();
    }
} 