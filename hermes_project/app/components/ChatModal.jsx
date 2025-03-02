"use client";
import React from "react";

export default function ChatModal({ match, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl p-6 z-10 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-black">
          {match.firstname} {match.lastname}
        </h2>
        <p className="text-gray-800 mb-4">
          {match.interests_text}
        </p>
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
