"use client";
import React from "react";

export default function ChatCard({ match, onSelect, number }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl transition-all"
      onClick={onSelect}
    >
      <div className="flex items-center">
        {/* Display the user number */}
        <span className="text-gray-500 font-bold mr-2">{number}.</span>
        <div>
          <h2 className="text-xl font-bold text-black">
            {match.firstname} {match.lastname}
          </h2>
          <p className="text-gray-700 mt-2">{match.interests_text}</p>
        </div>
      </div>
    </div>
  );
}
