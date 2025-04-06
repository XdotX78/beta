import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function HeroSection() {
    return (
        <section className="relative h-[85vh] flex items-center">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/enhanced/hero-background.jpg"
                    alt="World map background"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover brightness-50"
                />
            </div>
            <div className="hero-gradient-overlay"></div>
            <div className="container mx-auto px-4 relative z-10 text-white">
                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                        Discover Our World&apos;s <span className="text-gradient">News, History, and Mysteries</span>
                    </h1>
                    <p className="text-xl mb-8 text-gray-300">
                        Explore interactive maps showcasing real-time events, historical timelines,
                        and the world&apos;s most intriguing mysteries.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div className="relative group">
                            <Link
                                href="/maps"
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full font-medium flex items-center transition duration-300 glow-effect"
                            >
                                Explore Maps <FaArrowRight className="ml-2" />
                            </Link>
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                                <Link
                                    href="/maps/news"
                                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-indigo-100"
                                >
                                    News Map
                                </Link>
                                <Link
                                    href="/maps/history"
                                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-indigo-100"
                                >
                                    History Map
                                </Link>
                                <Link
                                    href="/maps/mysteries"
                                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-indigo-100"
                                >
                                    Mysteries Map
                                </Link>
                            </div>
                        </div>
                        <Link
                            href="/blogs/news"
                            className="px-6 py-3 bg-transparent border border-white hover:bg-white/10 rounded-full font-medium flex items-center transition duration-300"
                        >
                            Read Our Blogs <FaArrowRight className="ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
} 