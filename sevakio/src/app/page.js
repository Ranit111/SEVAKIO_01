import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import HowItWorks from "@/components/HowItWorks";
import TopRatedMechanics from "@/components/TopRatedMechanics";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-gray-50">
      <Header />
      <HeroSection />
      <ServicesGrid />
      <HowItWorks />
      <TopRatedMechanics />
      <Footer />
    </main>
  );
}
