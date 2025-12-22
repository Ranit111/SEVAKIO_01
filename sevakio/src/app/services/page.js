"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useState } from "react";

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    { id: 1, name: "Car Mechanics", icon: "🚗", color: "bg-blue-100" },
    { id: 2, name: "Electrician", icon: "⚡", color: "bg-yellow-100" },
    { id: 3, name: "Plumbing", icon: "🚰", color: "bg-cyan-100" },
    { id: 4, name: "AC Repair", icon: "❄️", color: "bg-blue-100" },
    { id: 5, name: "Appliances", icon: "🔧", color: "bg-orange-100" },
  ];

  const expertsData = {
    1: [ // Car Mechanics
      { id: 1, name: "Souvik Bhunia", specialization: "Expert Car Mechanics", rating: 4.8, reviews: 120, avatar: "👨‍💼", services: ["Expert Car Mechanics"] },
      { id: 2, name: "Ranit Jana", specialization: "Expert Car Mechanics", rating: 4.8, reviews: 120, avatar: "👨‍💼", services: ["Expert Car Mechanics"] },
    ],
    2: [ // Electrician
      { id: 5, name: "Priya Singh", specialization: "Expert Electrician", rating: 4.7, reviews: 95, avatar: "👩‍🔧", services: ["Expert Electrician"] },
      { id: 7, name: "Amit Sharma", specialization: "Expert Electrician", rating: 4.9, reviews: 105, avatar: "👨‍💼", services: ["Expert Electrician"] },
    ],
    3: [ // Plumbing
      { id: 6, name: "Raj Kumar", specialization: "Plumbing Expert", rating: 4.9, reviews: 110, avatar: "👨‍🏭", services: ["Plumbing Expert"] },
      { id: 8, name: "Vikram Patel", specialization: "Plumbing Expert", rating: 4.6, reviews: 88, avatar: "👨‍💼", services: ["Plumbing Expert"] },
    ],
    4: [ // AC Repair
      { id: 9, name: "Rohit Verma", specialization: "AC Repair Expert", rating: 4.7, reviews: 92, avatar: "👨‍💼", services: ["AC Repair Expert"] },
      { id: 10, name: "Neha Gupta", specialization: "AC Repair Expert", rating: 4.8, reviews: 105, avatar: "👩‍🔧", services: ["AC Repair Expert"] },
    ],
    5: [ // Appliances
      { id: 11, name: "Suresh Kumar", specialization: "Appliances Expert", rating: 4.9, reviews: 115, avatar: "👨‍💼", services: ["Appliances Expert"] },
      { id: 12, name: "Divya Nair", specialization: "Appliances Expert", rating: 4.7, reviews: 98, avatar: "👩‍🔧", services: ["Appliances Expert"] },
    ],
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      <Header />

      {/* Services Section */}
      <section className="px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* If no service selected, show service cards */}
          {!selectedService ? (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Select a Service
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`${service.color} rounded-2xl p-8 text-center cursor-pointer transform transition hover:scale-105 hover:shadow-lg`}
                  >
                    <div className="text-5xl mb-4">{service.icon}</div>
                    <h2 className="text-lg font-bold text-gray-800">{service.name}</h2>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Show experts with filters
            <div>
              {/* Back Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
              >
                ← Back to Services
              </button>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Left Sidebar - Filters */}
                <div className="md:col-span-1">
                  <div className="bg-white rounded-xl p-5 shadow-md sticky top-20">
                    <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                      <span>⚙️</span> Filters
                    </h2>

                    {/* Rating Filter */}
                    <div className="mb-5">
                      <h3 className="font-bold text-gray-800 text-sm mb-2">Rating</h3>
                      <div className="border-2 border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50">
                        <span className="text-lg">👍</span>
                        <select className="bg-transparent flex-1 focus:outline-none font-semibold text-gray-700 text-sm">
                          <option>All Ratings</option>
                          <option>⭐⭐⭐⭐⭐ 5 Stars</option>
                          <option>⭐⭐⭐⭐ 4+ Stars</option>
                          <option>⭐⭐⭐ 3+ Stars</option>
                        </select>
                      </div>
                    </div>

                    {/* Distance Filter */}
                    <div className="mb-5">
                      <h3 className="font-bold text-gray-800 text-sm mb-2">Distance</h3>
                      <div className="border-2 border-blue-600 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-blue-50">
                        <span className="text-lg">📍</span>
                        <select className="bg-transparent flex-1 focus:outline-none font-semibold text-gray-700 text-sm">
                          <option>Any Distance</option>
                          <option>Within 5 km</option>
                          <option>Within 10 km</option>
                          <option>Within 20 km</option>
                          <option>Within 50 km</option>
                        </select>
                      </div>
                    </div>

                    {/* Availability Filter */}
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm mb-2">Availability</h3>
                      <div className="space-y-2">
                        <div className="border-2 border-green-500 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-green-50">
                          <span className="text-lg">📈</span>
                          <span className="font-semibold text-gray-700 text-sm">Today</span>
                        </div>
                        <div className="border-2 border-red-500 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-red-50">
                          <span className="text-lg">📉</span>
                          <span className="font-semibold text-gray-700 text-sm">Tomorrow</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Expert Listings */}
                <div className="md:col-span-3">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Available Experts - {services.find(s => s.id === selectedService)?.name}
                  </h2>
                  <div className="space-y-4">
                    {expertsData[selectedService]?.map((expert) => (
                      <div
                        key={expert.id}
                        className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition flex gap-4 items-start"
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center text-3xl border-4 border-gray-300">
                            {expert.avatar}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-blue-600 mb-0.5">
                            {expert.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">{expert.specialization}</p>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</span>
                            <span className="text-gray-600 text-xs">({expert.reviews} Reviews)</span>
                          </div>

                          {/* Services */}
                          <div className="flex items-center gap-2">
                            <span className="text-green-500 text-sm">✓</span>
                            <span className="text-gray-700 font-medium text-sm">
                              {expert.services[0]}
                            </span>
                          </div>
                        </div>

                        {/* Call & Rate Button */}
                        <div className="flex-shrink-0">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold text-xs transition shadow-md whitespace-nowrap">
                            Call & Rate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
