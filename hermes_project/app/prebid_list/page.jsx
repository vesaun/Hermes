'use client';
import { useEffect, useState } from 'react';
import Navbar from "../components/Nav";
import Footer from "../components/footer";

export default function PreBidList() {
  const [prebids, setPrebids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreBids = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/getPreBids"); // Backend route
        const data = await res.json();
        setPrebids(data); // should be array of { name, email, fraternity }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch pre-bids", error);
        setLoading(false);
      }
    };

    fetchPreBids();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Pre-Bid Members</h1>
        {loading ? (
          <p>Loading pre-bids...</p>
        ) : (
          <div className="space-y-4">
            {prebids.map((user, index) => (
            <div key={index} className="border-b pb-4">
                <p className="font-medium text-black">
                {user.name} <span className="text-gray-600 text-sm">({user.email})</span>
                </p>
                <p className="text-xs text-gray-500">
                Fraternity: {user.fraternity.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                </p>
            </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
