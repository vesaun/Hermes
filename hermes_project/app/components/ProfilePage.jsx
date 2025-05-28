"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetch(`http://localhost:8080/api/findUserData/${firebaseUser.email}`)
          .then((res) => res.json())
          .then((data) => {
            if (!data.error) setUserData(data[0]);
          });
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user || !userData) return <div className="p-10 text-white">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center mb-6 border">
        <div className="flex items-center gap-6">
          <img
            src={userData.headshot || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-xl font-bold">{userData.first_name} {userData.last_name}</h2>
            <p className="text-sm text-gray-600">{userData.major}</p>
            <p className="text-sm text-gray-500">{userData.hometown_city}, {userData.hometown_state}</p>
          </div>
        </div>
        <button className="text-sm text-blue-600 font-medium">✏️ Edit</button>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Personal information</h3>
          <button className="text-sm text-blue-600 font-medium">✏️ Edit</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><strong>First Name</strong><div>{userData.first_name}</div></div>
          <div><strong>Last Name</strong><div>{userData.last_name}</div></div>
          <div><strong>Email address</strong><div>{userData.email}</div></div>
          <div><strong>Phone</strong><div>{userData.phone_number}</div></div>
          <div><strong>Major</strong><div>{userData.major}</div></div>
          <div><strong>Instagram</strong><div>{userData.instagram_handle}</div></div>
          <div><strong>GPA</strong><div>{userData.gpa}</div></div>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Address</h3>
          <button className="text-sm text-blue-600 font-medium">✏️ Edit</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><strong>Country</strong><div>{userData.hometown_country}</div></div>
          <div><strong>City/State</strong><div>{userData.hometown_city}, {userData.hometown_state}</div></div>
          <div><strong>High School</strong><div>{userData.highschool}</div></div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">About</h3>
          <button className="text-sm text-blue-600 font-medium">✏️ Edit</button>
        </div>
        <div className="space-y-4">
          <div>
            <strong>Rush Interest</strong>
            <p>{userData.rush_interest}</p>
          </div>
          <div>
            <strong>High School Activities</strong>
            <p>{userData.hs_activities}</p>
          </div>
          <div>
            <strong>High School Accomplishments</strong>
            <p>{userData.hs_accomplishments}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
