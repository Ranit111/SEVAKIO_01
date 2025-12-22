import Link from "next/link";

export default function TopRatedMechanics() {
  const mechanics = [
    {
      id: 1,
      name: "Surajit Kar",
      specialization: "Expert Mechanic",
      rating: 4.9,
      reviews: 120,
      avatar: "🧑‍💼",
      services: ["Expert Car Experience", "Certified Mechanic", "Customer Reviews"],
      featured: true,
    },
    {
      id: 2,
      name: "Sekhar Adak",
      specialization: "Expert Car Repair",
      rating: 4.8,
      reviews: 95,
      avatar: "👨‍🔧",
      services: ["Fast Service", "Certified Professional", "Verified Reviews"],
    },
    {
      id: 3,
      name: "Priya Singh",
      specialization: "Electrician Expert",
      rating: 4.7,
      reviews: 87,
      avatar: "👩‍🔧",
      services: ["24/7 Available", "Certified", "Affordable"],
    },
    {
      id: 4,
      name: "Raj Kumar",
      specialization: "Plumbing Specialist",
      rating: 4.6,
      reviews: 72,
      avatar: "🧑‍🏭",
      services: ["Emergency Service", "Quick Response", "Guaranteed"],
    },
    {
      id: 5,
      name: "Neha Sharma",
      specialization: "AC Repair Expert",
      rating: 4.9,
      reviews: 110,
      avatar: "👩‍💼",
      services: ["Expert Repair", "Certified", "Affordable Rates"],
    },
    {
      id: 6,
      name: "Vikram Patel",
      specialization: "Appliance Repair",
      rating: 4.8,
      reviews: 98,
      avatar: "🧔",
      services: ["All Brands", "Warranty", "Quick Fix"],
    },
  ];

  const featuredMechanic = mechanics.find((m) => m.featured);
  const otherMechanics = mechanics.filter((m) => !m.featured);

  return (
    <section className="px-6 md:px-12 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-10">
          Top Rated Experts
        </h2>

        {/* Mechanics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mechanics.map((mechanic) => (
            <div
              key={mechanic.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {/* Header with profile bg */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center">
                <div className="text-6xl mb-3">{mechanic.avatar}</div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  {mechanic.name}
                </h3>
                <p className="text-blue-600 font-semibold text-xs mb-2">
                  {mechanic.specialization}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3 justify-center">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-bold text-gray-800 text-sm">
                    {mechanic.rating}
                  </span>
                  <span className="text-gray-600 text-xs">
                    ({mechanic.reviews} Reviews)
                  </span>
                </div>

                {/* Services List */}
                <div className="space-y-0.5 mb-3 text-xs">
                  {mechanic.services.slice(0, 2).map((service, idx) => (
                    <p key={idx} className="text-gray-600">
                      <span className="text-blue-600">✓</span> {service}
                    </p>
                  ))}
                </div>

                {/* Book Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg font-bold text-sm transition">
                  Book & Reviews
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
