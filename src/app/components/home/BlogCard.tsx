import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface BlogCardProps {
    title: string;
    description: string;
    imageSrc: string;
    linkHref: string;
    category: string;
    categoryColor: string;
    accentColor: string;
}

export default function BlogCard({
    title,
    description,
    imageSrc,
    linkHref,
    category,
    categoryColor,
    accentColor,
}: BlogCardProps) {
    return (
        <div className="rounded-xl overflow-hidden shadow-xl feature-card backdrop-blur-sm bg-white/90 border border-gray-200">
            <div className="h-64 relative">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                />
                <div className={`absolute top-4 left-4 ${categoryColor} text-white py-1 px-3 rounded-full text-sm font-medium`}>
                    {category}
                </div>
            </div>
            <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
                <p className="text-gray-600 mb-6">
                    {description}
                </p>
                <Link
                    href={linkHref}
                    className={`inline-flex items-center ${accentColor} hover:text-opacity-80 font-medium`}
                >
                    Read the {title.split(' ')[0]} Blog <FaArrowRight className="ml-2" />
                </Link>
            </div>
        </div>
    );
} 