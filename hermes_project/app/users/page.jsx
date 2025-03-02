"use client";

import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import UserModal from "../components/UserModal";
import Navbar from "../components/Nav";
import Footer from "../components/footer";
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/getUserData"); // Ensure correct API URL
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
    <Navbar />
    {/* <div className="min-h-screen bg-gray-100 flex flex-col items-center p-5 transition-all"> */}
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white flex flex-col items-center p-5 transition-all">
      <h1 className="text-3xl font-bold mb-6 text-black">Users List</h1>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4">
          {users.map((user, index) => (
            <UserCard key={index} user={user} onMoreInfo={() => setSelectedUser(user)} />
          ))}
        </div>
      )}

      {/* Show modal if a user is selected */}
      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
    <Footer />
    </>
  );
}


