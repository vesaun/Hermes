// "use client";
// import { motion } from "framer-motion";
// import { FaStar } from "react-icons/fa";
// import { useState, useEffect } from "react";

// export default function FratCard({ frat, recruiterEmail, onMoreInfo, onStarUpdate }) {
//   const [isStarred, setIsStarred] = useState(frat.starred || false);
//   const [note, setNote] = useState(frat.note || "");

//   useEffect(() => {
//     if (isStarred) {
//       fetch("http://localhost:8080/api/starFrat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ recruiter_email: recruiterEmail, frat_name: frat.name, starred: true, note }),
//       });
//       onStarUpdate && onStarUpdate(frat.name, true, note);
//     }
//   }, [note]);

//   const handleStar = async () => {
//     const newStarState = !isStarred;
//     setIsStarred(newStarState);

//     const response = await fetch("http://localhost:8080/api/starFrat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ recruiter_email: recruiterEmail, frat_name: frat.name, starred: newStarState, note }),
//     });

//     if (response.ok) {
//       onStarUpdate && onStarUpdate(frat.name, newStarState, note);
//     }
//   };

//   if (!frat) return null;

//   return (
//     <motion.div className="relative bg-gradient-to-b from-gray-100 to-gray-300 text-black rounded-xl shadow-md p-8 flex flex-col items-center gap-6 w-80 h-auto justify-between border border-gray-400" whileHover={{ y: -10, scale: 1.03 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}>
//       <FaStar className={`absolute top-4 right-4 cursor-pointer text-2xl ${isStarred ? "text-yellow-400" : "text-gray-400"}`} onClick={handleStar} />
//       <img src={frat.logoImage || "https://via.placeholder.com/200"} alt={`${frat.name} Logo`} className="w-40 h-40 object-cover border-4 border-gray-200 rounded-lg" onError={(e) => (e.target.src = "https://via.placeholder.com/200")} />
//       <div className="flex flex-col flex-grow items-center justify-center">
//         <h2 className="text-2xl font-bold text-black text-center">{frat.name}</h2>
//         <p className="text-gray-600 text-center">{frat.address || "No address provided"}</p>
//       </div>
//       <button className="text-lg text-blue-600 hover:underline cursor-pointer" onClick={onMoreInfo}>+ More information</button>
//       {isStarred && (
//         <textarea className="mt-4 w-full p-2 text-sm border rounded-md" placeholder="Write notes about this fraternity..." value={note} onChange={(e) => setNote(e.target.value)} />
//       )}
//     </motion.div>
//   );
// }



"use client";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function FratCard({ frat, recruiterEmail, onMoreInfo, onStarUpdate }) {
  const [isStarred, setIsStarred] = useState(frat.starred || false);
  const [note, setNote] = useState(frat.note || "");

  // Save note only if already starred
  useEffect(() => {
    if (isStarred) {
      fetch("http://localhost:8080/api/starFrat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiter_email: recruiterEmail,
          frat_name: frat.name,
          starred: true,
          note,
        }),
      });
      onStarUpdate && onStarUpdate(frat.name, true, note); // Notify parent component of star update
    }
  }, [note]);

  const handleStar = async () => {
    const newStarState = !isStarred;
    setIsStarred(newStarState);

    const response = await fetch("http://localhost:8080/api/starFrat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recruiter_email: recruiterEmail,
        frat_name: frat.name,
        starred: newStarState,
        note,
      }),
    });

    if (response.ok) {
      onStarUpdate && onStarUpdate(frat.name, newStarState, note); // Notify parent component of star update
    }
  };

  if (!frat) return null;

  return (
    <motion.div
      className="relative bg-gradient-to-b from-gray-100 to-gray-300 text-black rounded-xl shadow-md p-8 flex flex-col items-center gap-6 w-80 h-auto justify-between border border-gray-400"
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
      {/* ✅ Fix: Parent is now relative, so star positions correctly */}
      <FaStar
        className={`absolute top-4 right-4 cursor-pointer text-2xl ${
          isStarred ? "text-yellow-400" : "text-gray-400"
        }`}
        onClick={handleStar}
      />

      <img
        src={frat.logoImage || "https://via.placeholder.com/200"}
        alt={`${frat.name} Logo`}
        className="w-40 h-40 object-cover border-4 border-gray-200 rounded-lg"
        onError={(e) => (e.target.src = "https://via.placeholder.com/200")}
      />

      <div className="flex flex-col flex-grow items-center justify-center">
        <h2 className="text-2xl font-bold text-black text-center">{frat.name}</h2>
        <p className="text-gray-600 text-center">{frat.address || "No address provided"}</p>
      </div>

      <button
        className="text-lg text-blue-600 hover:underline cursor-pointer"
        onClick={onMoreInfo}
      >
        + More information
      </button>

      {isStarred && (
        <textarea
          className="mt-4 w-full p-2 text-sm border rounded-md"
          placeholder="Write notes about this fraternity..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      )}
    </motion.div>
  );
}