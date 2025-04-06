import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import NewsArticleCard from '@/app/components/cards/NewsArticleCard';
import { Article } from '@/types/Article';

export const dynamic = 'force-dynamic';

// Define valid categories and their associated keywords
const VALID_CATEGORIES = [
    'wars',
    'world-politics',
    'economy',
    'disaster',
    'science-tech',
    'planet-people',
    'culture-curiosities',
    // Specific conflict categories
    'ukraine',
    'palestine',
    'sudan',
    'myanmar',
    'ethiopia',
    'taiwan'
];

const CONFLICT_KEYWORDS: Record<string, string[]> = {
    'ukraine': ['ukraine', 'russia', 'kyiv', 'moscow', 'zelensky', 'putin', 'donbas', 'crimea', 'kharkiv', 'odesa', 'mariupol', 'donetsk', 'luhansk'],
    'palestine': ['gaza', 'israel', 'palestine', 'hamas', 'west bank', 'jerusalem', 'netanyahu', 'idf', 'rafah', 'tel aviv', 'ceasefire', 'humanitarian'],
    'sudan': ['sudan', 'khartoum', 'rsf', 'rapid support forces', 'sudanese armed forces', 'darfur', 'hemedti', 'burhan'],
    'myanmar': ['myanmar', 'burma', 'rohingya', 'tatmadaw', 'aung san suu kyi', 'yangon', 'nug', 'naypyidaw', 'ethnic armed organizations'],
    'ethiopia': ['ethiopia', 'tigray', 'amhara', 'oromia', 'addis ababa', 'abiy ahmed', 'tplf'],
    'taiwan': ['taiwan', 'taipei', 'china', 'pla', 'strait', 'tsai ing-wen', 'chinese military', 'taiwan strait', 'cross-strait']
};

async function getCategoryArticles(category: string): Promise<Article[]> {
    try {
        const response = await fetch('https://betamaximum.net/news/data.json', { next: { revalidate: 60 } });
        const data = await response.json();

        if (!data || !Array.isArray(data)) {
            console.error('Invalid data format:', data);
            return [];
        }

        // Logic for conflict-specific categories
        if (CONFLICT_KEYWORDS[category]) {
            const keywords = CONFLICT_KEYWORDS[category];
            return data.filter((article: Article) => {
                const titleAndContent = (article.title + ' ' + article.content).toLowerCase();
                return keywords.some(keyword => titleAndContent.includes(keyword.toLowerCase()));
            });
        }

        // Standard category filtering
        if (category === 'wars' || category === 'world-politics' || category === 'economy' ||
            category === 'disaster' || category === 'science-tech' || category === 'planet-people' ||
            category === 'culture-curiosities') {
            return data.filter((article: Article) => article.category === category);
        }

        return data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
    const { category } = params;

    if (!VALID_CATEGORIES.includes(category)) {
        notFound();
    }

    const articles = await getCategoryArticles(category);

    // Function to get the proper category title
    const getCategoryTitle = (cat: string) => {
        const titles: Record<string, string> = {
            'wars': 'Wars & Conflicts',
            'world-politics': 'World Politics',
            'economy': 'Economy',
            'disaster': 'Disasters & Crises',
            'science-tech': 'Science & Technology',
            'planet-people': 'Planet & People',
            'culture-curiosities': 'Culture & Curiosities',
            'ukraine': 'Ukraine War',
            'palestine': 'Gaza-Israel Conflict',
            'sudan': 'Sudan Civil War',
            'myanmar': 'Myanmar Civil War',
            'ethiopia': 'Ethiopian Conflicts',
            'taiwan': 'Taiwan Strait Tensions'
        };
        return titles[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
    };

    // Get category icons
    const getCategoryIcon = (cat: string) => {
        const icons: Record<string, string> = {
            'wars': '⚔️',
            'world-politics': '📰',
            'economy': '💹',
            'disaster': '🌪️',
            'science-tech': '🧠',
            'planet-people': '🌿',
            'culture-curiosities': '🎭',
            'ukraine': '🇺🇦',
            'palestine': '🇵🇸',
            'sudan': '🇸🇩',
            'myanmar': '🇲🇲',
            'ethiopia': '🇪🇹',
            'taiwan': '🇹🇼'
        };
        return icons[cat] || '📄';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Link href="/blogs/news" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
                    <FaArrowLeft className="mr-2" /> Back to All News
                </Link>
                <h1 className="text-4xl font-bold text-gray-900">
                    {getCategoryIcon(category)} {getCategoryTitle(category)}
                </h1>
                {CONFLICT_KEYWORDS[category] && (
                    <p className="text-gray-600 mt-4 max-w-3xl">
                        {category === 'ukraine' && 'The ongoing Russian invasion of Ukraine that began in February 2022, marking Europe\'s largest conventional military attack since World War II.'}
                        {category === 'palestine' && 'The intense conflict between Israel and Hamas that escalated in October 2023, resulting in thousands of casualties and a severe humanitarian crisis in Gaza.'}
                        {category === 'sudan' && 'The ongoing civil war in Sudan between the Sudanese Armed Forces and the paramilitary Rapid Support Forces since April 2023.'}
                        {category === 'myanmar' && 'The civil war and political crisis in Myanmar following the military coup in February 2021.'}
                        {category === 'ethiopia' && 'Multiple regional conflicts in Ethiopia, including tensions in Tigray, Amhara, and Oromia regions.'}
                        {category === 'taiwan' && 'Escalating tensions in the Taiwan Strait, with increased Chinese military activities including naval exercises and air incursions.'}
                    </p>
                )}
            </div>

            {articles.length === 0 ? (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-medium text-gray-600">No articles found for this category</h2>
                    <p className="mt-4 text-gray-500">Check back later for updates</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article: Article) => (
                        <NewsArticleCard key={article.id} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
} 