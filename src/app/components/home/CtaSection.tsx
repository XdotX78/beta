import Link from "next/link";
import { FaMapMarkedAlt } from "react-icons/fa";

export default function CtaSection() {
    return (
        <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin Your Journey of Discovery Today</h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    Explore our interactive maps, dive into our blogs, and uncover the fascinating stories of our world.
                </p>
                <Link
                    href="/maps/news"
                    className="px-8 py-4 bg-white text-indigo-900 hover:bg-gray-100 rounded-full font-bold text-lg inline-flex items-center transition duration-300 floating-btn glow-effect"
                >
                    <FaMapMarkedAlt className="mr-2" /> Start Exploring Now
                </Link>
            </div>
        </section>
    );
} 