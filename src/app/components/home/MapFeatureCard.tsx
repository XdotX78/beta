import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { IconType } from "react-icons";

interface MapFeatureCardProps {
    title: string;
    description: string;
    imageSrc: string;
    linkHref: string;
    accentColor: string;
    Icon: IconType;
    tagline: string;
}

export default function MapFeatureCard({
    title,
    description,
    imageSrc,
    linkHref,
    accentColor,
    Icon,
    tagline,
}: MapFeatureCardProps) {
    return (
        <div className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden group hover:transform hover:scale-105 transition duration-300 feature-card">
            <div className="h-48 relative overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="p-4">
                        <div className="flex items-center mb-2">
                            <Icon className={`${accentColor} mr-2`} />
                            <h3 className="text-xl font-bold">{title}</h3>
                        </div>
                        <p className="text-gray-300 text-sm">{tagline}</p>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <p className="mb-4 text-gray-300">
                    {description}
                </p>
                <Link
                    href={linkHref}
                    className={`inline-flex items-center ${accentColor} hover:text-opacity-80`}
                >
                    Explore {title} <FaArrowRight className="ml-2" />
                </Link>
            </div>
        </div>
    );
} 