"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from "../components/Nav";

export default function FraternityProfile() {
  const [userFraternity, setUserFraternity] = useState("");
  const [fraternityData, setFraternityData] = useState(null);
  const [rotatingImages, setRotatingImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.email));
        const userData = userDoc.data();
        if (userData?.admin && userData?.fraternity) {
          setUserFraternity(userData.fraternity.toLowerCase().replace(/\s+/g, "_"));
          setIsEditable(true);
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userFraternity) return;

    const fetchFraternityData = async () => {
      const docRef = doc(db, "chapters", userFraternity);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setFraternityData(data);

        const modals = [];
        for (let i = 1; i <= 5; i++) {
          const modalUrl = data[`modal${i}`];
          if (modalUrl) modals.push(modalUrl);
        }
        setRotatingImages(modals);
      }
    };

    fetchFraternityData();
  }, [userFraternity]);

  useEffect(() => {
    if (rotatingImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % rotatingImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [rotatingImages]);

  const handleInputChange = (field, value) => {
    setFraternityData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLeaderChange = (index, field, value) => {
    const updatedLeadership = [...fraternityData.leadership];
    updatedLeadership[index][field] = value;
    setFraternityData((prev) => ({ ...prev, leadership: updatedLeadership }));
  };

  const handlePhotoUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const storage = getStorage();
    const extension = file.name.split('.').pop();
    const storageRef = ref(storage, `fraternity_photos/${userFraternity}/${key}.${extension}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    if (key.startsWith("leader_photo_")) {
      const index = parseInt(key.split("_").pop());
      const updatedLeadership = [...fraternityData.leadership];
      updatedLeadership[index].photo = url;
      setFraternityData((prev) => ({ ...prev, leadership: updatedLeadership }));
    } else {
      setFraternityData((prev) => ({ ...prev, [key]: url }));
    }
  };

  const handleSave = async () => {
    const docRef = doc(db, "chapters", userFraternity);
    await updateDoc(docRef, fraternityData);
    setIsEditing(false);
  };

  if (!fraternityData) return <p className="text-center mt-10">Loading fraternity profile...</p>;

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src={rotatingImages[currentImage] || "/fallback.jpg"}
                alt="Fraternity"
                className="w-full h-80 object-cover"
              />
              {isEditing &&
                rotatingImages.map((_, i) => (
                  <input
                    key={i}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, `modal${i + 1}`)}
                    className="block w-full mt-2 text-gray-500"
                    placeholder={`Upload image ${i + 1}`}
                  />
                ))}
            </div>

            <div className="text-center mt-4 p-4 border-10 border-white bg-gray-100 shadow-md">
              {isEditing ? (
                <input
                  value={fraternityData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="text-5xl font-bold text-black w-full text-center"
                />
              ) : (
                <h1 className="text-5xl font-bold text-black">{fraternityData.name}</h1>
              )}
              <p className="text-sm text-black">
                {isEditing ? (
                  <input
                    value={fraternityData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full text-black"
                  />
                ) : (
                  fraternityData.address
                )}
              </p>
              {isEditing ? (
                <input
                  value={fraternityData.instagram}
                  onChange={(e) => handleInputChange("instagram", e.target.value)}
                  className="w-full text-black"
                />
              ) : (
                <a
                  href={`https://instagram.com/${fraternityData.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 mt-1 hover:underline block"
                >
                  @{fraternityData.instagram}
                </a>
              )}
            </div>
          </div>

          <div className="col-span-1 space-y-6">
            {isEditing ? (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, "map_url")}
                className="w-full text-gray-500"
              />
            ) : (
              <img
                src={fraternityData.map_url}
                alt="Map"
                className="rounded-lg shadow-md w-full h-32 object-cover"
              />
            )}

            <div className="p-4 border-10 border-white bg-gray-100 shadow-md">
              <h2 className="text-xl font-bold mb-2 text-black">About</h2>
              {isEditing ? (
                <textarea
                  value={fraternityData.about}
                  onChange={(e) => handleInputChange("about", e.target.value)}
                  className="w-full text-black"
                />
              ) : (
                <p className="text-sm text-gray-700">{fraternityData.about}</p>
              )}
            </div>

            <div className="p-4 border-10 border-white bg-gray-100 shadow-md">
              <h2 className="text-xl font-bold mb-2 text-black">Fast Stats</h2>
              {[
                { label: "Member count", field: "member_count" },
                { label: "Founded", field: "founded" },
                { label: "GPA", field: "gpa" },
              ].map(({ label, field }) => (
                <p key={field} className="text-sm text-black">
                  <span className="font-semibold">{label}:</span>{" "}
                  {isEditing ? (
                    <input
                      value={fraternityData[field] || ""}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full text-black"
                    />
                  ) : (
                    fraternityData[field]
                  )}
                </p>
              ))}
            </div>
          </div>

          <div className="col-span-1 space-y-6">
            <div className="p-4 border-10 border-white bg-white shadow-md">
              {isEditing ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, "logo_url")}
                  className="w-full text-gray-500"
                />
              ) : (
                <img
                  src={fraternityData.logo_url}
                  alt="Fraternity Logo"
                  className="w-full h-56 object-contain"
                />
              )}
            </div>

            <div className="p-4 border-10 border-white bg-gray-100 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-center text-black">Leadership</h2>
              <div className="flex flex-col gap-4">
                {(fraternityData.leadership || []).map((leader, i) => (
                  <div key={i} className="flex items-center gap-4">
                    {isEditing ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, `leader_photo_${i}`)}
                        className="w-14 text-gray-500"
                      />
                    ) : (
                      <img
                        src={leader.photo || "/profile-placeholder.jpg"}
                        alt="Leader"
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    )}
                    <div>
                      {isEditing ? (
                        <>
                          <input
                            value={leader.name}
                            onChange={(e) => handleLeaderChange(i, "name", e.target.value)}
                            className="block w-full text-black"
                          />
                          <input
                            value={leader.position}
                            onChange={(e) => handleLeaderChange(i, "position", e.target.value)}
                            className="block w-full text-black"
                          />
                          <input
                            value={leader.phone}
                            onChange={(e) => handleLeaderChange(i, "phone", e.target.value)}
                            className="block w-full text-black"
                          />
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-black">{leader.name}</p>
                          <p className="text-sm text-gray-600">{leader.position}</p>
                          <p className="text-sm text-gray-600">{leader.phone}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isEditable && (
          <div className="text-right mt-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit This Page"}
            </button>
            {isEditing && (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleSave}
              >
                Save Changes
              </button>
            )}
          </div>
        )}

        <div className="mt-8">
          <div className="w-full h-8 bg-purple-800"></div>
          <div className="w-full h-8 bg-yellow-400"></div>
          <div className="w-full h-8 bg-purple-800"></div>
        </div>
      </div>
    </>
  );
}



