import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <main className="bg-orange-500 text-white min-h-screen">
      <Header />

      {/* About Section */}
      <div className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          <span className="text-blue-600">«««</span> About Us <span className="text-blue-600">»»»</span>
        </h1>

        {/* Main Content */}
        <div className="space-y-6 mb-12">
          <p className="text-sm leading-relaxed text-justify">
            Sevakio is a city-wise service platform designed to make everyday home and vehicle services simple, reliable, and accessible across India.
          </p>

          <p className="text-sm leading-relaxed text-justify">
            We connect customers with verified and skilled service professionals—including electricians, vehicle mechanics, plumbers, appliance repair experts, and more—through a seamless digital booking experience. Whether it's a quick repair or a scheduled service, Sevakio ensures the right help reaches you at the right time.
          </p>

          <p className="text-sm leading-relaxed text-justify">
            At Sevakio, we believe that finding trustworthy service should never be complicated. Our platform focuses on quality, transparency, and convenience, empowering users to book services with confidence while helping local professionals grow through technology.
          </p>
        </div>

        {/* What We Do Section */}
        <div className="mb-12">
          <h2 className="text-lg font-bold bg-yellow-300 text-black w-fit px-4 py-2 mb-6">What We Do</h2>
          <ul className="space-y-3 text-sm">
            <li>• Offer city-wise access to essential home and vehicle services</li>
            <li>• Partner with verified and experienced professionals</li>
            <li>• Provide transparent pricing and genuine customer reviews</li>
            <li>• Enable fast, easy, and secure service booking</li>
          </ul>
        </div>

        {/* Vision & Mission Section */}
        <div className="space-y-8 mb-12">
          <div>
            <p className="text-sm">
              <span className="font-bold underline">Our Vision:</span> To become India's most trusted digital platform for everyday services by simplifying service discovery and empowering skilled professionals nationwide.
            </p>
          </div>

          <div>
            <p className="text-sm">
              <span className="font-bold underline">Our Mission:</span> To deliver dependable, affordable, and high-quality services while creating opportunities for local service providers through a technology-driven ecosystem.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-12">
          <h2 className="text-lg font-bold bg-yellow-300 text-black w-fit px-4 py-2 mb-6">What We Do</h2>
          <ul className="space-y-3 text-sm">
            <li>✓ Trusted & verified professionals</li>
            <li>✓ Easy online booking</li>
            <li>✓ City-wise service availability</li>
            <li>✓ Customer-first approach</li>
          </ul>
        </div>
      </div>

      <Footer />
    </main>
  );
}
