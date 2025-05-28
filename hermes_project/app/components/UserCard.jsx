"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaStar, FaTimes } from "react-icons/fa";

export default function UserCard({ user, recruiterEmail, onMoreInfo, onStarUpdate, onHide }) {
  const [isStarred, setIsStarred] = useState(user.starred || false);
  const [isHidden, setIsHidden] = useState(user.hidden || false);
  const [note, setNote] = useState(user.note || "");

  useEffect(() => {
    if (isStarred) {
      fetch("http://localhost:8080/api/starUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiter_email: recruiterEmail,
          user_email: user.email,
          starred: true,
          note,
        }),
      });
      onStarUpdate && onStarUpdate(user.email, true, note);
    }
  }, [note]);

  const handleStar = async () => {
    const newStarState = !isStarred;
    setIsStarred(newStarState);

    const response = await fetch("http://localhost:8080/api/starUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recruiter_email: recruiterEmail,
        user_email: user.email,
        starred: newStarState,
        note,
      }),
    });

    if (response.ok) {
      onStarUpdate && onStarUpdate(user.email, newStarState, note);
    }
  };

  const handleHide = async () => {
    try {
      await fetch("http://localhost:8080/api/hideUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiter_email: recruiterEmail,
          user_email: user.email,
        }),
      });

      setIsHidden(true); // ✅ show red X right after hiding
      onHide && onHide(user.email);
    } catch (err) {
      console.error("Error hiding user:", err);
    }
  };

  return (
    <motion.div className="relative bg-gradient-to-b from-gray-100 to-gray-300 text-black rounded-xl shadow-md p-8 flex flex-col items-center gap-6 w-70 h-auto justify-between border border-gray-400">
      {/* <FaTimes
        className={`absolute top-4 left-4 cursor-pointer text-xl ${
          isHidden ? "text-red-500" : "text-gray-500 hover:text-red-500"
        }`}
        title="Hide this user"
        onClick={handleHide}
      /> */}
      {user.hidden ? (
        <FaTimes
          className="absolute top-4 left-4 cursor-pointer text-xl text-red-500 hover:text-green-500"
          title="Unhide this user"
          onClick={async () => {
            await fetch("http://localhost:8080/api/unhideUser", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                recruiter_email: recruiterEmail,
                user_email: user.email,
              }),
            });
            onHide(user.email, false); // set hidden to false
          }}
        />
      ) : (
        <FaTimes
          className="absolute top-4 left-4 cursor-pointer text-xl text-gray-500 hover:text-red-500"
          title="Hide this user"
          onClick={async () => {
            await fetch("http://localhost:8080/api/hideUser", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                recruiter_email: recruiterEmail,
                user_email: user.email,
              }),
            });
            onHide(user.email, true); // set hidden to true
          }}
        />
      )}

      <FaStar
        className={`absolute top-4 right-4 cursor-pointer text-2xl ${
          isStarred ? "text-yellow-400" : "text-gray-400"
        }`}
        onClick={handleStar}
      />
      <img
        src={user.headshot ? user.headshot : "https://via.placeholder.com/150"}
        alt={`${user.firstname} ${user.lastname}`}
        className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
      />


      <div>
        <h2 className="text-xl font-bold text-black">{user.first_name} {user.last_name}</h2>
        <p className="text-gray-600">{user.hometown}</p>
        <p className="text-gray-500">{user.major}</p>

        <button
          className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer"
          onClick={onMoreInfo}
        >
          + More information
        </button>
      </div>

      {isStarred && (
        <textarea
          className="mt-4 w-full p-2 text-sm border rounded-md"
          placeholder="Write notes about this user..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      )}
    </motion.div>
  );
}
  