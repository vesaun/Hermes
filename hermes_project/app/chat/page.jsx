"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Nav"; 
import Footer from "../components/footer"; 
import ChatCard from "../components/ChatCard";
import ChatModal from "../components/ChatModal";
import Link from "next/link";

export default function ChatPage() {
  const [matches, setMatches] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [query, setQuery] = useState(
    "I am interested in artificial intelligence, machine learning, and data science."
  );

  // Function to fetch matches using the current query
  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/findMatches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: query }),
      });
      const data = await response.json();
      setMatches(data.top_matches);
      setSummary(data.summary);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch matches when the component mounts (with the default query)
  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-5 transition-all">
        <h1 className="text-3xl font-bold mb-6 text-black">Chat Matches</h1>
        
        {/* Query Input Area */}
        <div className="mb-6 w-full max-w-md">
          <textarea
            className="text-black w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your interests here..."
          ></textarea>
          <button
            onClick={fetchMatches}
            className="mt-3 w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Find Matches
          </button>
        </div>

        {loading ? (
          <p className="text-black font-bold">Loading matches...</p>
        ) : (
          <>
            {/* LLM-generated summary inside a centered, rounded container */}
            <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto mb-6">
              <p className="text-black">{summary}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full px-4">
              {matches.map((match, index) => (
                <ChatCard
                  key={index}
                  number={index + 1}
                  match={match.profile} // adjust according to your API response structure
                  onSelect={() => setSelectedMatch(match.profile)}
                />
              ))}
            </div>
          </>
        )}
        {/* Show a modal when a match is selected */}
        {selectedMatch && (
          <ChatModal
            match={selectedMatch}
            onClose={() => setSelectedMatch(null)}
          />
        )}
        <div className="mt-8">
          <Link
            href="/"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-red transition-colors shadow-md"
          >
            Go Back Home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
