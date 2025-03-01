"use client";
import Navbar from "../components/Nav";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="text-center py-20 bg-blue-800 text-white">
        <h1 className="text-5xl font-bold">About IFC</h1>
        <p className="text-lg mt-4 max-w-2xl mx-auto">
          The Interfraternity Council (IFC) is dedicated to promoting leadership, brotherhood, and service within the Greek community.
        </p>
      </header>

      {/* Main Content Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-blue-900 text-center">Our Mission</h2>
        <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto mt-4">
          IFC serves as the governing body for fraternities, ensuring they operate with integrity, community service, and a commitment to academic excellence. We provide resources and a structured environment for fraternities to thrive.
        </p>
      </section>

      {/* Values Section */}
      <section className="bg-blue-100 py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-blue-900">Core Values</h2>
          <div className="mt-8 flex flex-col md:flex-row gap-6 justify-center">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-sm">
              <h3 className="text-xl font-bold text-blue-900">Brotherhood</h3>
              <p className="text-gray-700 mt-2">
                Building lifelong friendships and fostering unity among fraternity members.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 max-w-sm">
              <h3 className="text-xl font-bold text-blue-900">Leadership</h3>
              <p className="text-gray-700 mt-2">
                Encouraging leadership roles and developing future professionals.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 max-w-sm">
              <h3 className="text-xl font-bold text-blue-900">Service</h3>
              <p className="text-gray-700 mt-2">
                Giving back to the community through philanthropy and volunteer work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Get Involved */}
      <section className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl font-bold text-blue-900">Get Involved</h2>
        <p className="text-gray-700 text-lg mt-4 max-w-3xl mx-auto">
          Whether you’re a prospective member, current student, or alumni, there are many ways to support and engage with IFC.
        </p>
        <div className="mt-6">
          <a href="/information" className="bg-blue-900 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
            Learn More
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-4 mt-10">
        &copy; {new Date().getFullYear()} IFC Fraternity Network. All Rights Reserved.
      </footer>
    </div>
  );
}
