import React from 'react';
import Link from 'next/link';
import { FaClock, FaGlobe, FaExternalLinkAlt } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '@/types/Article';

interface NewsArticleCardProps {
    article: Article;
}

const NewsArticleCard: React.FC<NewsArticleCardProps> = ({ article }) => {
    // Format the date relative to now (e.g., "3 hours ago")
    const formattedDate = article.timestamp
        ? formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })
        : 'Recently';

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
            <div className="p-6 flex-grow">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 rounded-full px-3 py-1">
                        {article.source}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                        <FaClock className="mr-1" size={12} />
                        {formattedDate}
                    </span>
                </div>

                <h3 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h3>

                <p className="text-gray-600 mb-4 line-clamp-3">{article.content}</p>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                {article.location && (
                    <div className="flex items-center text-sm text-gray-600">
                        <FaGlobe className="mr-1" size={14} />
                        <span>
                            {article.location.country || article.location.name || 'Global'}
                        </span>
                    </div>
                )}

                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    Read More <FaExternalLinkAlt className="ml-1" size={12} />
                </a>
            </div>
        </div>
    );
};

export default NewsArticleCard; 