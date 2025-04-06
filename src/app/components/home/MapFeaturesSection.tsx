import { FaNewspaper, FaHistory } from "react-icons/fa";
import { GiSpookyHouse } from "react-icons/gi";
import MapFeatureCard from "./MapFeatureCard";

export default function MapFeaturesSection() {
    const mapFeatures = [
        {
            title: "Real-time News Map",
            tagline: "Stay updated with global events as they happen",
            description: "Track ongoing global events, breaking news, and emerging stories in real-time through our interactive map.",
            imageSrc: "/images/enhanced/news-map-preview.jpg",
            linkHref: "/maps/news",
            accentColor: "text-indigo-400",
            Icon: FaNewspaper
        },
        {
            title: "Historical Timeline",
            tagline: "Journey through time with our interactive historical map",
            description: "Explore significant historical events, civilizations, and discoveries throughout human history with our interactive timeline.",
            imageSrc: "/images/enhanced/history-map-preview.jpg",
            linkHref: "/maps/history",
            accentColor: "text-purple-400",
            Icon: FaHistory
        },
        {
            title: "Mysteries & Secrets",
            tagline: "Uncover enigmatic locations and unexplained phenomena",
            description: "Discover mysterious locations, unexplained phenomena, and conspiracy theories from around the world.",
            imageSrc: "/images/enhanced/mysteries-map-preview.jpg",
            linkHref: "/maps/mysteries",
            accentColor: "text-teal-400",
            Icon: GiSpookyHouse
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-gray-900 to-indigo-900 text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Interactive World Maps</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Dive into our three unique interactive maps, each offering a different perspective on our world.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {mapFeatures.map((feature, index) => (
                        <MapFeatureCard
                            key={index}
                            title={feature.title}
                            tagline={feature.tagline}
                            description={feature.description}
                            imageSrc={feature.imageSrc}
                            linkHref={feature.linkHref}
                            accentColor={feature.accentColor}
                            Icon={feature.Icon}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
} 