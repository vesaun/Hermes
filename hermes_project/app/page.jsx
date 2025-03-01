"use client"; // Ensure this is a Client Component

import { useEffect, useState } from "react";
import Navbar from "./components/Nav"; 
import Link from "next/link";

export default function HomePage() {
  const [year, setYear] = useState(null);

  // Fix Hydration Error by setting the current year on the client
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Reusable Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <header className="text-center py-20 bg-blue-800 text-white">
        <h2 className="text-4xl font-bold">Welcome to the IFC Fraternity Network</h2>
        <p className="text-lg mt-4 max-w-2xl mx-auto">
          A centralized platform for fraternities to post events, share updates, and connect with the community.
        </p>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-10">
        <h3 className="text-3xl font-bold text-center text-blue-900">What is IFC?</h3>
        <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto mt-4">
          The <strong>Interfraternity Council (IFC)</strong> governs and supports fraternities on campus, ensuring strong brotherhood, leadership, and service. Our platform allows fraternities to manage their events and share important updates with their members.
        </p>
      </section>

      {/* Call to Action */}
      <div className="text-center py-10">
        <Link href="/information">
          <button className="bg-blue-900 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
            Learn More About IFC
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-4 mt-10">
        &copy; {year ? year : "Loading..."} IFC Fraternity Network. All Rights Reserved.
      </footer>
    </div>
  );
}
