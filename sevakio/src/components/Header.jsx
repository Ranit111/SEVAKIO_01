"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const avatarUrl =
    user?.photoURL ||
    (user?.providerData && user.providerData[0] && user.providerData[0].photoURL) ||
    "";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
      {/* Logo + Name */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="bg-white text-blue-600 w-7 h-7 rounded flex items-center justify-center font-bold text-sm">
          S
        </div>
        <Link href="/" className="font-bold text-base hidden sm:inline cursor-pointer hover:text-blue-100">
          Sevakio
        </Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden text-white hover:text-blue-100 transition"
      >
        {isMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Navigation Links - Hidden on Mobile */}
      <div className="hidden lg:flex items-center gap-6 flex-1 mx-6 justify-start">
        <Link
          href="/services"
          className="text-white text-sm font-medium hover:text-blue-100 transition"
        >
          Services
        </Link>
        <Link
          href="/about"
          className="text-white text-sm font-medium hover:text-blue-100 transition"
        >
          About Us
        </Link>
        <Link
          href="/contact"
          className="text-white text-sm font-medium hover:text-blue-100 transition"
        >
          Contact Us
        </Link>
      </div>

      {/* Search Bar - Centered on larger screens */}
      <div className="hidden lg:flex items-center gap-2 flex-1 mx-6 justify-center">
        <input
          type="text"
          placeholder="Search for mechanic, electrician, vehicle service..."
          className="px-4 py-1.5 rounded-lg bg-white text-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 w-80"
        />
        <button className="bg-white hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-medium text-sm transition">
          🔍
        </button>
      </div>

      {/* Login/User Button */}
      {isLoading ? (
        <div className="hidden lg:flex bg-gray-400 text-white px-3 py-1.5 rounded-lg font-semibold text-sm flex-shrink-0">
          Loading...
        </div>
      ) : user ? (
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-white/30 flex items-center justify-center text-sm font-bold">
              👤
            </div>
          )}
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition flex-shrink-0"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          <Link
            href="/login"
            className="bg-white text-blue-600 px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition flex-shrink-0"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-white text-blue-600 px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition flex-shrink-0"
          >
            Sign Up
          </Link>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-blue-600 shadow-lg rounded-b-lg py-4 px-6 space-y-4 lg:hidden">
          {/* Mobile Search Bar */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 px-3 py-2 rounded-lg bg-white text-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="bg-white hover:bg-gray-100 text-gray-600 px-2.5 py-2 rounded-lg font-medium text-sm transition">
              🔍
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <Link
            href="/services"
            className="block text-white text-sm font-medium hover:text-blue-100 transition py-2 border-b border-blue-500"
          >
            Services
          </Link>
          <Link
            href="/about"
            className="block text-white text-sm font-medium hover:text-blue-100 transition py-2 border-b border-blue-500"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="block text-white text-sm font-medium hover:text-blue-100 transition py-2 border-b border-blue-500"
          >
            Contact Us
          </Link>

          {/* Mobile Login/Logout Button */}
          {isLoading ? (
            <div className="block w-full bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold text-sm text-center mt-2">
              Loading...
            </div>
          ) : user ? (
            <div className="space-y-3">
              {avatarUrl ? (
                <div className="flex items-center gap-3 py-2 px-2">
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <span className="text-white text-sm font-medium">
                    {user.displayName || user.email}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-2 px-2">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-white/30 flex items-center justify-center text-base font-bold text-white">
                    👤
                  </div>
                  <span className="text-white text-sm font-medium">
                    {user.displayName || user.email}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="block w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition text-center mt-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2 mt-2">
              <Link
                href="/login"
                className="block w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition text-center"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
