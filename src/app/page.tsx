import HeroSection from "./components/home/HeroSection";
import MapFeaturesSection from "./components/home/MapFeaturesSection";
import BlogSection from "./components/home/BlogSection";
import CtaSection from "./components/home/CtaSection";

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <MapFeaturesSection />
      <BlogSection />
      <CtaSection />
    </div>
  );
}
