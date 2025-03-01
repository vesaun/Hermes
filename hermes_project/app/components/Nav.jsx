"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-900 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          IFC Fraternity Network
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/about" className="hover:text-gray-300">About</Link>
          <Link href="/information" className="hover:text-gray-300">Information</Link>
          <Link href="/login" className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200">
            Log In
          </Link>
          <Link href="/signup" className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200">
            Sign Up
          </Link>
        </div>

 
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 text-center py-4">
          <Link href="/" className="block py-2 hover:text-gray-300" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" className="block py-2 hover:text-gray-300" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/information" className="block py-2 hover:text-gray-300" onClick={() => setMenuOpen(false)}>Information</Link>
          <Link href="/login" className="block py-2 bg-white text-blue-900 px-4 py-2 mx-auto w-fit rounded-lg hover:bg-gray-200" onClick={() => setMenuOpen(false)}>
            Log In
          </Link>
        </div>
      )}
    </nav>
  );
}
