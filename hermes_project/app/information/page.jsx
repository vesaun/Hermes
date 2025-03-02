import Navbar from "../components/Nav";
import Footer from "../components/footer";

import Image from "next/image";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function InformationPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Hero Section */}
      <header className="relative bg-blue-800 text-white text-center py-20" data-aos="fade-up" data-aos-delay="100">
        <h1 className="text-5xl font-bold">IFC on The Hill</h1>
        <p className="text-lg mt-4 max-w-3xl mx-auto">
          Uniting fraternities through leadership, community service, and lifelong brotherhood on The Hill.
        </p>
      </header>

      {/* Section: About IFC on The Hill */}
      <section className="container mx-auto px-6 py-12 flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="100">
  <div className="max-w-3xl">
    <h2 className="text-3xl font-bold text-blue-900">What is IFC on The Hill?</h2>
    <p className="text-gray-700 text-lg mt-4">
      IFC on The Hill is the governing body for fraternities, ensuring a 
      <strong> safe, supportive, and thriving </strong> Greek community. 
      We promote <strong> brotherhood, leadership, philanthropy, and academic success </strong> among fraternities.
    </p>
    <p className="text-gray-700 text-lg mt-4">
      Whether you're looking to join a fraternity, organize events, or give back to the community, IFC on The Hill is here to support and guide you.
    </p>
  </div>

  {/* Centering the Image Below the Text */}
  {/* Uncomment if needed */}
  {/* <div className="mt-6">
    <Image
      src="/ifc-hill.jpg" // Replace with actual image file in public/
      alt="IFC on The Hill"
      width={500}
      height={300}
      className="rounded-lg shadow-md mx-auto"
    />
  </div> */}
</section>


      {/* Section: How to Get Involved */}
      <section className="bg-blue-100 py-12" data-aos="fade-up" data-aos-delay="100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-blue-900">How to Get Involved</h2>
          <p className="text-gray-700 text-lg mt-4 max-w-3xl mx-auto">
            Join an IFC fraternity, attend community events, or take on leadership roles to make a difference on The Hill.
          </p>

          <div className="mt-8 flex flex-col md:flex-row gap-6 justify-center" data-aos="fade-right" data-aos-delay="200">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-sm">
              <h3 className="text-xl font-bold text-blue-900">Rush a Fraternity</h3>
              <p className="text-gray-700 mt-2">
                Explore different fraternities and find the best fit for you.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 max-w-sm" data-aos="fade-down" data-aos-delay="200"> 
              <h3 className="text-xl font-bold text-blue-900">Attend IFC Events</h3>
              <p className="text-gray-700 mt-2">
                Get involved in philanthropy, leadership workshops, and social events.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 max-w-sm"data-aos="fade-right" data-aos-delay="200"> 
              <h3 className="text-xl font-bold text-blue-900">Become a Leader</h3>
              <p className="text-gray-700 mt-2">
                Take on executive roles and contribute to the future of Greek life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Contact & Socials */}
      <section className="container mx-auto px-6 py-12 text-center" data-aos="fade-up" data-aos-delay="100">
        <h2 className="text-3xl font-bold text-blue-900">Connect with IFC</h2>
        <p className="text-gray-700 text-lg mt-4 max-w-3xl mx-auto">
          Stay updated with IFC events, recruitment, and important announcements.
        </p>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}
