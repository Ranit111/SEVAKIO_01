import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-orange-500 text-white px-6 md:px-12 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Social Media Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Social Media</h2>
          <p className="mb-3 text-sm">Stay connected with us:</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">📘</span>
              <span className="font-bold text-sm cursor-pointer hover:underline">Facebook</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📷</span>
              <span className="font-bold text-sm cursor-pointer hover:underline">Instagram</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🐦</span>
              <span className="font-bold text-sm cursor-pointer hover:underline">Twitter / X</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">💼</span>
              <span className="font-bold text-sm cursor-pointer hover:underline">LinkedIn</span>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center pt-6 border-t border-orange-600">
          <p className="text-xs">
            © 2025 <span className="font-bold">Website name</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
