import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { serialize } from 'next-mdx-remote/serialize';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';

// Custom components for MDX
const components = {
    // Add custom components here if needed
};

// Get all post slugs for static paths
export async function generateStaticParams() {
    const postsDirectory = path.join(process.cwd(), 'src/app/blogs/news/palestine/posts');
    const filenames = fs.readdirSync(postsDirectory);

    return filenames
        .filter(filename => filename.endsWith('.mdx'))
        .map(filename => ({
            slug: filename.replace(/\.mdx$/, ''),
        }));
}

// Get post content by slug
async function getPost(slug: string) {
    const postsDirectory = path.join(process.cwd(), 'src/app/blogs/news/palestine/posts');
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);

    try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        const mdxSource = await serialize(content, {
            mdxOptions: {
                remarkPlugins: [remarkGfm],
            },
            parseFrontmatter: true,
        });

        return {
            metadata: data,
            content: mdxSource,
        };
    } catch (error) {
        return null;
    }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    const { metadata, content } = post;

    return (
        <article className="max-w-4xl mx-auto px-4 py-12">
            {/* Article Header */}
            <header className="mb-12">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <span>{metadata.date}</span>
                    <span>•</span>
                    <span>{metadata.readTime}</span>
                    {metadata.location && (
                        <>
                            <span>•</span>
                            <span>{metadata.location}</span>
                        </>
                    )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    {metadata.title}
                </h1>

                <p className="text-xl text-gray-600 mb-6">
                    {metadata.excerpt}
                </p>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <span className="font-medium">{metadata.author}</span>
                    </div>

                    {metadata.tags && (
                        <div className="flex gap-2">
                            {metadata.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
                <MDXRemote source={content.compiledSource} />
            </div>
        </article>
    );
} 