export interface Post {
    slug: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    location?: string;
    featured?: boolean;
    tags?: string[];
    content: string;
} 