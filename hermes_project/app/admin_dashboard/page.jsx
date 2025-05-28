'use client';
import { useState } from 'react';
import Navbar from "../components/Nav";

export default function AdminDashboard() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const sendEmail = async () => {
    const res = await fetch('http://localhost:8080/api/sendMassEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const result = await res.json();
    if (res.ok) {
      setStatus("✅ Emails sent successfully.");
      setMessage('');
    } else {
      setStatus(`❌ Error: ${result.error}`);
    }
  };

  return (
    <>
    <Navbar />
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Send Email to All Users</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your email message here..."
        className="w-full border border-gray-400 rounded p-4 h-40"
      />
      <button
        onClick={sendEmail}
        className="mt-4 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
      >
        Send Email
      </button>
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
    </>
  );
}
