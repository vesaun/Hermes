import Navbar from "../components/Nav";
import Image from "next/image";

export default function InformationPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Hero Section */}
      <header className="relative bg-blue-800 text-white text-center py-20">
        <h1 className="text-5xl font-bold">IFC on The Hill</h1>
        <p className="text-lg mt-4 max-w-3xl mx-auto">
          Uniting fraternities through leadership, community service, and lifelong brotherhood on The Hill.
        </p>
      </header>

      {/* Section: About IFC on The Hill */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-900">What is IFC on The Hill?</h2>
            <p className="text-gray-700 text-lg mt-4">
              IFC on The Hill is the governing body for fraternities, ensuring a <strong>safe, supportive, and thriving</strong> Greek community. We promote <strong>brotherhood, leadership, philanthropy, and academic success</strong> among fraternities.
            </p>
            <p className="text-gray-700 text-lg mt-4">
              Whether you're looking to join a fraternity, organize events, or give back to the community, IFC on The Hill is here to support and guide you.
            </p>
          </div>
          {/*<Image
            src="/ifc-hill.jpg" // Replace with actual image file in public/
            alt="IFC on The Hill"
            width={500}
            height={300}
            className="rounded-lg shadow-md"
          />*/}
        </div>
      </section>

      {/* Section: How to Get Involved */}
      <section className="bg-blue-100 py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-blue-900">How to Get Involved</h2>
          <p className="text-gray-700 text-lg mt-4 max-w-3xl mx-auto">
            Join an IFC fraternity, attend community events, or take on leadership roles to make a difference on The Hill.
          </p>

          <div className="mt-8 flex flex-col md:flex-row gap-6 justify-center">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-sm">
              <h3 className="text-xl font-bold text-blue-900">Rush a Fraternity</h3>
              <p className="text-gray-700 mt-2">
                Explore different fraternities and find the best fit for you.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 max-w-sm">
              <h3 className="text-xl font-bold text-blue-900">Attend IFC Events</h3>
              <p className="text-gray-700 mt-2">
                Get involved in philanthropy, leadership workshops, and social events.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 max-w-sm">
              <h3 className="text-xl font-bold text-blue-900">Become a Leader</h3>
              <p className="text-gray-700 mt-2">
                Take on executive roles and contribute to the future of Greek life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Contact & Socials */}
      <section className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl font-bold text-blue-900">Connect with IFC</h2>
        <p className="text-gray-700 text-lg mt-4 max-w-3xl mx-auto">
          Stay updated with IFC events, recruitment, and important announcements.
        </p>

        <div className="flex justify-center mt-6 space-x-6">
          <a href="https://instagram.com/ifc" target="_blank" className="text-blue-900 text-xl font-bold hover:text-blue-700">
            Instagram
          </a>
          <a href="https://facebook.com/ifc" target="_blank" className="text-blue-900 text-xl font-bold hover:text-blue-700">
            Facebook
          </a>
          <a href="mailto:ifc@example.com" className="text-blue-900 text-xl font-bold hover:text-blue-700">
            Email Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-4 mt-10">
        &copy; {new Date().getFullYear()} IFC on The Hill. All Rights Reserved.
      </footer>
    </div>
  );
}
