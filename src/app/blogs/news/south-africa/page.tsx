import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaMap, FaHistory, FaTag, FaHandsHelping, FaGlobe } from "react-icons/fa";
import { Post } from "./types";

async function getPosts(): Promise<Post[]> {
    const postsDirectory = path.join(process.cwd(), "src/app/blogs/news/south-africa/posts");

    try {
        const files = await fs.readdir(postsDirectory);
        const posts = await Promise.all(
            files
                .filter((file) => file.endsWith(".mdx"))
                .map(async (file) => {
                    const filePath = path.join(postsDirectory, file);
                    const fileContent = await fs.readFile(filePath, "utf8");
                    const { data } = matter(fileContent);

                    return {
                        slug: file.replace(".mdx", ""),
                        title: data.title,
                        excerpt: data.excerpt,
                        imageUrl: data.imageUrl,
                        category: data.category,
                        author: data.author,
                        date: data.date,
                        readTime: data.readTime,
                        location: data.location,
                        featured: data.featured,
                        tags: data.tags,
                    } as Post;
                })
        );

        return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error("Error reading posts:", error);
        return [];
    }
}

export default async function SouthAfricaPage() {
    const posts = await getPosts();

    if (!posts) {
        notFound();
    }

    const featuredPosts = posts.filter((post) => post.featured);

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Hero Section */}
            <div className="relative bg-cover bg-center h-[50vh]"
                style={{ backgroundImage: "url('/images/blog/south-africa-hero.jpg')" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-black/60 to-yellow-500/30"></div>
                <div className="relative container mx-auto px-4 h-full flex flex-col justify-center z-10">
                    <div className="flex items-center text-white text-sm mb-4">
                        <Link href="/blogs/news" className="hover:underline">News</Link>
                        <span className="mx-2">/</span>
                        <span>South Africa Coverage</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                        South Africa Coverage
                    </h1>

                    <p className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-100">
                        In-depth reporting on social, economic, and political developments in South Africa
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-white">
                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
                            <FaGlobe className="mr-2" />
                            <span>Regional Updates</span>
                        </div>
                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
                            <FaMap className="mr-2" />
                            <Link href="/maps/news?region=south-africa" className="hover:underline">
                                View on News Map
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column - Articles */}
                    <div className="lg:w-2/3">
                        {/* Featured Articles */}
                        {featuredPosts.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold mb-6">Featured Updates</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {featuredPosts.map((post) => (
                                        <Link
                                            key={post.slug}
                                            href={`/blogs/news/south-africa/${post.slug}`}
                                            className="group"
                                        >
                                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                                <div className="relative h-48">
                                                    <Image
                                                        src={post.imageUrl}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="p-6">
                                                    <div className="text-sm text-gray-600 mb-2">
                                                        {post.date} · {post.readTime}
                                                    </div>
                                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-gray-600">{post.excerpt}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Articles */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Latest Updates</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {posts.map((post) => (
                                    <Link
                                        key={post.slug}
                                        href={`/blogs/news/south-africa/${post.slug}`}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                            <div className="flex flex-col md:flex-row">
                                                <div className="md:w-1/3 relative h-48 md:h-auto">
                                                    <Image
                                                        src={post.imageUrl}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="md:w-2/3 p-6">
                                                    <div className="text-sm text-gray-600 mb-2">
                                                        {post.date} · {post.readTime}
                                                    </div>
                                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-gray-600">{post.excerpt}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:w-1/3">
                        {/* About This Coverage */}
                        <div className="bg-green-50 rounded-xl p-6 mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">About This Coverage</h3>
                            <p className="text-gray-700 mb-4">
                                Our South Africa coverage provides comprehensive reporting on social, economic, and political
                                developments across the nation, with a focus on key issues affecting its people and future.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Our team of correspondents across Southern Africa delivers timely updates and in-depth analysis
                                of this dynamic region.
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                <Link
                                    href="/maps/news?region=south-africa"
                                    className="inline-flex items-center text-sm bg-white px-3 py-1 rounded-full text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                                >
                                    <FaMap className="mr-1" size={10} />
                                    Interactive Map
                                </Link>
                                <Link
                                    href="/blogs/news?tag=south-africa-analysis"
                                    className="inline-flex items-center text-sm bg-white px-3 py-1 rounded-full text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                                >
                                    <FaTag className="mr-1" size={10} />
                                    Analysis
                                </Link>
                            </div>
                        </div>

                        {/* Key Facts */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Key Facts</h3>
                            <div className="space-y-4">
                                <div className="border-b border-gray-200 pb-3">
                                    <p className="text-sm text-gray-500">Population (2024)</p>
                                    <p className="text-lg font-semibold">60.4 million</p>
                                </div>
                                <div className="border-b border-gray-200 pb-3">
                                    <p className="text-sm text-gray-500">GDP</p>
                                    <p className="text-lg font-semibold">$405.9 billion</p>
                                </div>
                                <div className="border-b border-gray-200 pb-3">
                                    <p className="text-sm text-gray-500">Major Cities</p>
                                    <p className="text-lg font-semibold">9 provincial capitals</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Official Languages</p>
                                    <p className="text-lg font-semibold">11 languages</p>
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-gray-500">
                                Source: Statistics South Africa, World Bank (2024)
                            </div>
                        </div>

                        {/* Related Coverage */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Related Coverage</h3>
                            <div className="space-y-4">
                                <Link href="/blogs/news/africa-economy" className="block group">
                                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                        <div className="relative h-32">
                                            <Image
                                                src="/images/blog/africa-economy.jpg"
                                                alt="African Economy"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                                            <div className="absolute bottom-0 w-full p-4">
                                                <h4 className="text-lg font-bold text-white group-hover:text-green-300 transition-colors">
                                                    African Economy
                                                </h4>
                                                <p className="text-sm text-gray-300">Economic trends across Africa</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 