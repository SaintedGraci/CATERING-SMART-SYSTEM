import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <HowItWorks />
      <FeaturedPackages />
      <Testimonials />
      <CTASection />
    </div>
  );
}
