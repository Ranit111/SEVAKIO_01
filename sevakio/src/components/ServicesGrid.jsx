import Link from "next/link";

export default function ServicesGrid() {
  const services = [
    { name: "Electrician", icon: "⚡", color: "bg-yellow-100" },
    { name: "Vehicle Mechanic", icon: "🔧", color: "bg-purple-100" },
    { name: "AC Repair", icon: "❄️", color: "bg-blue-100" },
    { name: "Plumbing", icon: "🚰", color: "bg-orange-100" },
    { name: "Appliance Repair", icon: "💡", color: "bg-blue-100" },
  ];

  return (
    <section className="px-6 md:px-12 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-10">
          Popular Services
        </h2>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {services.map((service) => (
            <Link
              key={service.name}
              href={`/services/${service.name.toLowerCase()}`}
            >
              <div className={`${service.color} p-5 rounded-2xl text-center cursor-pointer hover:shadow-lg transition transform hover:scale-105`}>
                <div className="text-4xl mb-3">{service.icon}</div>
                <p className="text-gray-800 font-bold text-sm md:text-base">
                  {service.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
