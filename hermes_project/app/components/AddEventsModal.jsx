'use client';
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";

const fraternityList = [
  "Acacia", "Alpha Delta Phi", "Alpha Epsilon Pi", "Alpha Gamma Omega", "Alpha Phi Delta", "Alpha Kappa Lambda",
  "alpha sigma phi", "alpha tau omega", "chi psi", "delta kappa epsilon", "kappa alpha order", "phi kappa psi",
  "phi Gamma Delta", "phi kappa alpha", "pi kappa phi", "sigma alpha epsilon", "sigma nu", "tau kappa epsilon",
  "theta chi", "theta xi", "zeta beta tau", "N/A"
];

export default function AddEventsModal({ onClose, onEventCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [address, setAddress] = useState("");
  const [fraternity, setFraternity] = useState("N/A");
  const [isIFCAdmin, setIsIFCAdmin] = useState(false);

  useEffect(() => {
    const fetchIFCStatus = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const res = await fetch(`http://localhost:8080/api/findUserData/${user.email}`);
        const data = await res.json();
        const ifc = Array.isArray(data) ? data[0]?.ifc_admin === true : data?.ifc_admin === true;
        setIsIFCAdmin(ifc);
      } catch (err) {
        console.error("Failed to fetch IFC status", err);
      }
    };

    fetchIFCStatus();
   }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("You are not signed in.");
      window.location.href = "/";
      return;
    }

    const payload = {
      email: user.email,
      title,
      description,
      date,
      start_time: startTime,
      end_time: endTime,
      address,
      fraternity,
      created_by_ifc_admin: isIFCAdmin,
    };

    const res = await fetch("http://localhost:8080/api/addEvent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const saved = await res.json();
      onEventCreated?.({ ...payload, id: saved.id || Date.now().toString() });
      onClose();
    } else {
      alert("Failed to add event");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg shadow-xl p-8 w-full max-w-md relative border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl cursor-pointer"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-black">Create New Event</h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-black font-semibold">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 border px-3 py-2 rounded bg-white text-black"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-black font-semibold">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 border px-3 py-2 rounded bg-white text-black"
              rows="3"
              required
            ></textarea>
          </label>

          <label className="block mb-4">
            <span className="text-black font-semibold">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 border px-3 py-2 rounded bg-white text-black"
              required
            />
          </label>

          <div className="flex gap-4 mb-4">
            <label className="flex-1">
              <span className="text-black font-semibold">Start Time</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full mt-1 border px-3 py-2 rounded bg-white text-black"
                required
              />
            </label>

            <label className="flex-1">
              <span className="text-black font-semibold">End Time</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full mt-1 border px-3 py-2 rounded bg-white text-black"
                required
              />
            </label>
          </div>

          <label className="block mb-4">
            <span className="text-black font-semibold">Address</span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mt-1 border px-3 py-2 rounded bg-white text-black"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-black font-semibold">Fraternity</span>
            <input
                list="frats"
                value={fraternity}
                onChange={(e) => setFraternity(e.target.value)}
                className="w-full mt-1 border px-3 py-2 rounded bg-white text-black"
                required
            />
            <datalist id="frats">
                <option value="N/A" />
                <option value="Acacia" />
                <option value="Alpha Delta Phi" />
                <option value="Alpha Epsilon Pi" />
                <option value="Alpha Gamma Omega" />
                <option value="Alpha Phi Delta" />
                <option value="Alpha Kappa Lambda" />
                <option value="Alpha Sigma Phi" />
                <option value="Alpha Tau Omega" />
                <option value="Chi Psi" />
                <option value="Delta Kappa Epsilon" />
                <option value="Kappa Alpha Order" />
                <option value="Phi Kappa Psi" />
                <option value="Phi Gamma Delta" />
                <option value="Phi Kappa Alpha" />
                <option value="Pi Kappa Phi" />
                <option value="Sigma Alpha Epsilon" />
                <option value="Sigma Nu" />
                <option value="Tau Kappa Epsilon" />
                <option value="Theta Chi" />
                <option value="Theta Xi" />
                <option value="Zeta Beta Tau" />
            </datalist>
            </label>


          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded mt-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}




  
  