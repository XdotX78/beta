export interface Post {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    category: string;
    author: string;
    date: string;
    readTime: number;
    location?: string;
    featured?: boolean;
    tags?: string[];
} 