"use client";

import { useEffect, useState } from "react";
import FratCard from "../components/FratCard";
import FratModal from "../components/FratModal";
import Navbar from "../components/Nav";
import Footer from "../components/footer";
export default function FratsPage() {
  const [frats, setFrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFrat, setSelectedFrat] = useState(null);

  useEffect(() => {
    const fetchFrats = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/getFratData"); // Ensure correct API URL
        const data = await response.json();
        setFrats(data);
      } catch (error) {
        console.error("Error fetching fraternities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFrats();
  }, []);

  return (
    <>
      {/* Navbar is outside of the centered container */}
      <Navbar />

      {/* Main container for the page content */}
      <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white flex flex-col items-center p-5 transition-all">

        {/* <h1 className="text-3xl font-bold mb-6 text-black">Fraternities List</h1> */}
        {loading ? (
          <p>Loading fraternities...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4">
            {frats.map((frat, index) => (
              <FratCard key={index} frat={frat} onMoreInfo={() => setSelectedFrat(frat)} />
            ))}
          </div>
        )}

        {selectedFrat && (
          <FratModal frat={selectedFrat} onClose={() => setSelectedFrat(null)} />
        )}
      </div>

      {/* Footer is also outside of the centered container */}
      <Footer />
    </>
  );
}

