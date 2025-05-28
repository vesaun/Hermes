"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


export default function FraternityProfile() {
  const [currentImage, setCurrentImage] = useState(0);
  const rotatingImages = [
    "https://firebasestorage.googleapis.com/v0/b/hackcu-452419.firebasestorage.app/o/fraternity_photos%2Fchi_psi%2Fchipsi_photo3.jpg?alt=media&token=fde48c9e-ed89-4fcc-97c1-9ddac594866f",
    "https://firebasestorage.googleapis.com/v0/b/hackcu-452419.firebasestorage.app/o/fraternity_photos%2Fchi_psi%2Fchipsi_photo1.jpeg?alt=media&token=be211535-27bc-403d-b6fd-a7582a75bd2e",
    "https://firebasestorage.googleapis.com/v0/b/hackcu-452419.firebasestorage.app/o/fraternity_photos%2Fchi_psi%2Fchipsi_photo2.jpeg?alt=media&token=a4991ab0-210a-4e27-8363-29fc94d51243",
    "https://firebasestorage.googleapis.com/v0/b/hackcu-452419.firebasestorage.app/o/fraternity_photos%2Fchi_psi%2Fchipsi_photo4.jpeg?alt=media&token=9d759b9a-49bd-42fd-8fcf-a6c92d10413c",
    "https://firebasestorage.googleapis.com/v0/b/hackcu-452419.firebasestorage.app/o/fraternity_photos%2Fchi_psi%2Fchipsi_photo5.jpeg?alt=media&token=c04343d8-6557-4a51-9696-bb2c31049b9c",

  ];

  const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.email));
        const data = userDoc.data();
        if (data?.admin && data?.fraternity?.toLowerCase() === "chi psi") {
            setIsEditable(true);
        }
        }
    });

    return () => unsubscribe();
    }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % rotatingImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <Link href="/calendar" className="text-sm text-black font-semibold mb-4 inline-block">
        ◀ Back to Calendar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="col-span-1">
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src={rotatingImages[currentImage]}
              alt="Fraternity House"
              className="w-full h-80 object-cover"
            />
          </div>
          <div className="text-center mt-4 p-4 border-10 border-white bg-gray-100 shadow-md">
            <h1 className="text-5xl font-bold text-black">Chi Psi</h1>
            <p className="text-sm text-gray-800">1080 14th Street</p>
            <a
                href="https://instagram.com/chipsiboulder"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 mt-1 hover:underline block"
                >
                @chipsiboulder
            </a>

          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <div className="col-span-1 space-y-6">
          <img src="https://firebasestorage.googleapis.com/v0/b/hackcu-452419.firebasestorage.app/o/fraternity_photos%2Fchi_psi%2Fchipsi_add1.png?alt=media&token=a027648b-670b-4dbf-9192-641c8002f263" alt="Map location" className="rounded-lg shadow-md w-full h-32 object-cover" />

          <div className="p-4 border-10 border-white bg-gray-100 shadow-md">
            <h2 className="text-xl font-bold mb-2 text-black">About</h2>
            <p className="text-sm text-gray-700">
              This is a short description of the fraternity. It can highlight values, events, facilities, or anything
              else you'd like users to know.
            </p>
          </div>

          <div className="p-4 border-10 border-white bg-gray-100 shadow-md">
            <h2 className="text-xl font-bold mb-2 text-black">Fast Stats</h2>
            <p className="text-sm text-sm text-gray-700"><span className="font-semibold text-sm text-gray-700">Member count:</span> 100</p>
            <p className="text-sm text-sm text-gray-700"><span className="font-semibold text-sm text-gray-700">Founded:</span> 1890</p>
            <p className="text-sm text-sm text-gray-700"><span className="font-semibold text-sm text-gray-700">GPA:</span> 3.45</p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-1 space-y-6">
            <div className="p-4 border-10 border-white bg-white shadow-md">
                <img src="https://firebasestorage.googleapis.com/v0/b/hackcu-452419.firebasestorage.app/o/fraternity_photos%2Fchi_psi%2Fchipsi_logo.jpg?alt=media&token=af1729fa-4aee-4cc1-8771-19f8325206e5" alt="Fraternity Logo" className="w-full h-56 object-contain" />
            </div>

          <div className="p-4 border-10 border-white bg-gray-100 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center text-black">Leadership</h2>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <img src="/profile-placeholder.jpg" alt="Leader" className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-black">Name {i}</p>
                    <p className="text-sm text-gray-600">Rush Chair</p>
                    <p className="text-sm text-gray-600">(123) 456-7890</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isEditable && (
        <div className="text-right mt-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Edit This Page
            </button>
        </div>
        )}

      {/* BOTTOM COLORS BAR */}
      <div className="mt-8">
        <div className="w-full h-8 bg-purple-800"></div>
        <div className="w-full h-8 bg-yellow-400"></div>
        <div className="w-full h-8 bg-purple-800"></div>
      </div>

    </div>
  );
}

