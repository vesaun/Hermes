"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UserCard from "../components/UserCard";
import UserModal from "../components/UserModal";
import Navbar from "../components/Nav";
import Footer from "../components/footer";
import Link from "next/link";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [starredMap, setStarredMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  const recruiterEmail = session?.user?.email;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/getUserData");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchStarred = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/getStarredUsers/${recruiterEmail}");
        const data = await res.json();
        setStarredMap(data);
      } catch (err) {
        console.error("Error fetching starred users:", err);
      }
    };

    if (recruiterEmail) {
      fetchUsers();
      fetchStarred().finally(() => setLoading(false));
    }
  }, [recruiterEmail]);

  const handleStarUpdate = (userEmail, starred, note) => {
    setStarredMap((prev) => ({
      ...prev,
      [userEmail]: { starred, note },
    }));
  };
  

  const mergedUsers = users.map((user) => ({
    ...user,
    starred: starredMap[user.email]?.starred || false,
    note: starredMap[user.email]?.note || "",
  }));

  const filteredUsers = showStarredOnly
    ? mergedUsers.filter((user) => user.starred)
    : mergedUsers;

  // ✅ Move conditionals AFTER hooks
  if (status === "loading") {
    return <p className="text-center mt-20 text-black">Loading session...</p>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B] flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl mb-4">You are not signed in.</h2>
          <Link
            href="/"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white flex flex-col items-center p-5 transition-all">
        <button
          onClick={() => setShowStarredOnly(!showStarredOnly)}
          className="mb-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showStarredOnly ? "Show All Users" : "Show Starred Only"}
        </button>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4">
            {filteredUsers.map((user, index) => (
              <UserCard
                key={index}
                user={user}
                recruiterEmail={recruiterEmail}
                onMoreInfo={() => setSelectedUser(user)}
                onStarUpdate={handleStarUpdate} // Pass the function to update starred state
              />
            ))}
          </div>
        )}

        {selectedUser && (
          <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        )}
      </div>
      <Footer />
    </>
  );
}