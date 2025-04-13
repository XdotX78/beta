"use client";

import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

// Define props for the actual MDX component (often empty)
interface MdxProps {
    components?: any;
    frontmatter?: {
        title: string;
        date: string;
        author: string;
        description?: string;
        tags?: string[];
    };
}

interface MdxRendererProps {
    source: MDXRemoteSerializeResult;
    components?: Record<string, React.ComponentType>;
}

const LoadingFallback = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>
);

const ErrorFallback = ({ error }: { error: Error }) => (
    <div className="text-red-500 p-4 border border-red-700 rounded-lg bg-red-900/20">
        <h3 className="font-bold mb-2">Error loading content</h3>
        <p className="text-sm">{error.message}</p>
    </div>
);

export default function MdxRenderer({ source, components }: MdxRendererProps) {
    return (
        <div className="prose dark:prose-invert max-w-none">
            <MDXRemote {...source} components={components} />
        </div>
    );
} 