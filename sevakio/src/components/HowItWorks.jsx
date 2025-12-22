export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Choose Service",
      icon: "👆",
      description: "Select the service you need",
    },
    {
      number: "2",
      title: "Select Mechanic",
      icon: "👨‍🔧",
      description: "Pick from verified professionals",
    },
    {
      number: "3",
      title: "Book & Relax",
      icon: "✅",
      description: "Confirm booking and relax",
    },
  ];

  return (
    <section className="px-6 md:px-12 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-12">
          How It Works
        </h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Step Circle */}
              <div className="flex justify-center mb-5">
                <div className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center">
                  <span className="text-xl font-bold">{step.number}</span>
                </div>
              </div>

              {/* Icon */}
              <div className="text-4xl mb-3">{step.icon}</div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm">
                {step.description}
              </p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 w-12 h-1 bg-blue-300 transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
