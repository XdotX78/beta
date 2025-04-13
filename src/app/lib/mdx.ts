import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMetadata {
    title: string;
    date: string;
    author: string;
    description?: string;
    imageUrl?: string;
    category?: string;
    tags?: string[];
    readTime?: string;
    location?: string;
    featured?: boolean;
}

export async function getPalestinePosts() {
    const postsDirectory = path.join(process.cwd(), 'src/app/blogs/news/palestine/posts');

    // Create directory if it doesn't exist
    if (!fs.existsSync(postsDirectory)) {
        fs.mkdirSync(postsDirectory, { recursive: true });
    }

    const files = fs.readdirSync(postsDirectory);
    const posts = files
        .filter(file => file.endsWith('.mdx'))
        .map(file => {
            const filePath = path.join(postsDirectory, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(fileContent);

            return {
                ...data,
                slug: file.replace('.mdx', ''),
            } as PostMetadata & { slug: string };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

export async function getPalestinePost(slug: string) {
    const filePath = path.join(process.cwd(), 'src/app/blogs/news/palestine/posts', `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
        metadata: data as PostMetadata,
        content,
        slug,
    };
} 