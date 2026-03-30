"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-orange-600">
              CaterSmart
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/packages" className="text-gray-700 hover:text-orange-600 transition">
              Packages
            </Link>
            <Link href="/menu" className="text-gray-700 hover:text-orange-600 transition">
              Menu
            </Link>
            <Link href="/gallery" className="text-gray-700 hover:text-orange-600 transition">
              Gallery
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition">
              Contact
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-orange-600 transition">
              Login
            </Link>
            <Link
              href="/customize"
              className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link href="/packages" className="block text-gray-700 hover:text-orange-600 transition">
              Packages
            </Link>
            <Link href="/menu" className="block text-gray-700 hover:text-orange-600 transition">
              Menu
            </Link>
            <Link href="/gallery" className="block text-gray-700 hover:text-orange-600 transition">
              Gallery
            </Link>
            <Link href="/contact" className="block text-gray-700 hover:text-orange-600 transition">
              Contact
            </Link>
            <Link href="/login" className="block text-gray-700 hover:text-orange-600 transition">
              Login
            </Link>
            <Link
              href="/customize"
              className="block bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition text-center"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
