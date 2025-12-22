import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-white px-6 md:px-12 py-16 flex flex-col md:flex-row items-center justify-between gap-8 overflow-x-hidden">
      {/* Left Content */}
      <div className="flex-1 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-3 leading-tight">
          Book Trusted Mechanics & Home Services Near You
        </h1>
        
        <p className="text-gray-600 text-base mb-6 font-medium">
          Fast • Verified • Affordable
        </p>

        {/* Buttons */}
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/services"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold text-base transition shadow-md"
          >
            Book a Service
          </Link>

          <Link
            href="/become-partner"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-base transition shadow-md"
          >
            Become a Partner
          </Link>
        </div>
      </div>

      {/* Right Image Placeholder */}
      <div className="hidden md:flex flex-1 items-center justify-center overflow-hidden">
        <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-8 w-full max-w-sm h-96 flex items-center justify-center box-border">
          <div className="text-center">
            <div className="text-6xl mb-4">🔧</div>
            <p className="text-gray-600 font-semibold">Service Illustration</p>
          </div>
        </div>
      </div>
    </section>
  );
}
