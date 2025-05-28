"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Nav";
import Footer from "../components/footer";
import Link from "next/link";

export default function AccountInformationTab() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser?.email) {
        const res = await fetch(`http://localhost:8080/api/findUserData/${firebaseUser.email}`);
        const data = await res.json();
        setUserData(data[0]);
        setFormData(data[0]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch("http://localhost:8080/api/updateUserData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, updates: formData })
      });

      if (!res.ok) throw new Error("Failed to update user data");

      const updated = await res.json();
      setUserData(updated);
      setEditingSection(null);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  if (loading) return <p className="text-black">Loading profile...</p>;

  const formatField = (value) => value || "N/A";

  const renderField = (label, fieldName) => (
    <p>
      <strong>{label}</strong><br />
      {editingSection ? (
        <input
          name={fieldName}
          value={formData[fieldName] || ""}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      ) : (
        formatField(userData[fieldName])
      )}
    </p>
  );

  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={userData?.headshot || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-20 h-20 rounded-full border"
              />
              <div>
                <h2 className="text-xl font-bold">{userData?.first_name} {userData?.last_name}</h2>
                <p>{formatField(userData?.major)}</p>
                <p>{formatField(userData?.hometown_city)}, {formatField(userData?.hometown_state)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 border">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Personal information</h3>
            {editingSection === 'personal' ? (
              <div className="space-x-2">
                <button className="text-sm text-green-600" onClick={handleSave}>Save</button>
                <button className="text-sm text-red-500" onClick={() => setEditingSection(null)}>Cancel</button>
              </div>
            ) : (
              <button className="text-sm text-blue-500 hover:underline" onClick={() => setEditingSection('personal')}>✎ Edit</button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {renderField("First Name", "first_name")}
            {renderField("Last Name", "last_name")}
            {renderField("Email address", "email")}
            {renderField("Phone", "phone_number")}
            {renderField("Major", "major")}
            {renderField("Instagram", "instagram_handle")}
            {renderField("GPA", "gpa")}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 border">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Address</h3>
            {editingSection === 'address' ? (
              <div className="space-x-2">
                <button className="text-sm text-green-600" onClick={handleSave}>Save</button>
                <button className="text-sm text-red-500" onClick={() => setEditingSection(null)}>Cancel</button>
              </div>
            ) : (
              <button className="text-sm text-blue-500 hover:underline" onClick={() => setEditingSection('address')}>✎ Edit</button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {renderField("Country", "hometown_country")}
            <div>
                <p className="font-semibold">City/State</p>
                <p>{`${userData?.hometown_city || "N/A"}, ${userData?.hometown_state || ""}`}</p>
            </div>
            {renderField("High School", "highschool")}
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-lg shadow p-6 border">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">About</h3>
            {editingSection === 'about' ? (
              <div className="space-x-2">
                <button className="text-sm text-green-600" onClick={handleSave}>Save</button>
                <button className="text-sm text-red-500" onClick={() => setEditingSection(null)}>Cancel</button>
              </div>
            ) : (
              <button className="text-sm text-blue-500 hover:underline" onClick={() => setEditingSection('about')}>✎ Edit</button>
            )}
          </div>
          <div className="space-y-4">
            {renderField("Rush Interest", "rush_interest")}
            {renderField("High School Activities", "hs_activities")}
            {renderField("High School Accomplishments", "hs_accomplishments")}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}



