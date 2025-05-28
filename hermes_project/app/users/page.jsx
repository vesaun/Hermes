"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import UserCard from "../components/UserCard";
import UserModal from "../components/UserModal";
import Navbar from "../components/Nav";
import Footer from "../components/footer";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [starredMap, setStarredMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [user, setUser] = useState(null);
  const [gpaFilter, setGpaFilter] = useState(0);
  const [majorCategory, setMajorCategory] = useState("All");
  const [filterStarred, setFilterStarred] = useState(false);
  const [nameQuery, setNameQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [hiddenMap, setHiddenMap] = useState({});
  const [showHidden, setShowHidden] = useState(false);

  const recruiterEmail = user?.email;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

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
        const res = await fetch(`http://localhost:8080/api/getStarredUsers/${recruiterEmail}`);
        const data = await res.json();
        setStarredMap(data);
      } catch (err) {
        console.error("Error fetching starred users:", err);
      }
    };

    const fetchHidden = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/getHiddenUsers/${recruiterEmail}`);
        const data = await res.json(); // assume it's an array of emails
        const map = {};
        data.forEach(email => map[email] = true);
        setHiddenMap(map);
      } catch (err) {
        console.error("Error fetching hidden users:", err);
      }
    };

    if (recruiterEmail) {
      fetchUsers();
      fetchStarred();
      fetchHidden().finally(() => setLoading(false));
    }
  }, [recruiterEmail]);

  const handleStarUpdate = (userEmail, starred, note) => {
    setStarredMap((prev) => ({
      ...prev,
      [userEmail]: { starred, note },
    }));
  };

  const handleHideUser = async (userEmail) => {
    try {
      await fetch("http://localhost:8080/api/hideUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recruiter_email: recruiterEmail, user_email: userEmail }),
      });
      setHiddenMap((prev) => ({ ...prev, [userEmail]: true }));
    } catch (err) {
      console.error("Error hiding user:", err);
    }
  };

  const majorCategories = {
    Engineering: [
      "Aerospace Engineering",
      "Applied Mathematics",
      "Architectural Engineering",
      "Biological Engineering",
      "Biomedical Engineering",
      "Chemical Engineering",
      "Civil Engineering",
      "Computer Science",
      "Creative Technology & Design",
      "Electrical Engineering",
      "Electrical and Computer Engineering",
      "Engineering Physics",
      "Environmental Engineering",
      "Integrated Design Engineering",
      "Mechanical Engineering"
    ],
    Business: [
      "Accounting",
      "Finance",
      "Marketing",
      "Management & Entrepreneurship",
      "Real Estate"
    ],
    "Arts and Science": [
      "Anthropology",
      "Astrophysics",
      "Biochemistry",
      "Chemistry",
      "Classics",
      "Ecology and Evolutionary Biology",
      "Economics",
      "English",
      "Environmental Studies",
      "Film Studies",
      "Geography",
      "Geology",
      "History",
      "International Affairs",
      "Linguistics",
      "Mathematics",
      "Molecular Biology",
      "Neuroscience",
      "Philosophy",
      "Physics",
      "Political Science",
      "Psychology",
      "Sociology",
      "Spanish",
      "Theatre"
    ]
  };

  const getCategory = (major) => {
    for (const category in majorCategories) {
      if (majorCategories[category].includes(major)) return category;
    }
    return "Other";
  };

  const mergedUsers = users.map((user) => ({
    ...user,
    starred: starredMap[user.email]?.starred || false,
    note: starredMap[user.email]?.note || "",
    hidden: hiddenMap[user.email] || false
  }));

  const filteredUsers = mergedUsers.filter((user) => {
    const passesStar = filterStarred ? user.starred : true;
    const passesGpa = user.gpa ? parseFloat(user.gpa) >= gpaFilter : false;
    const category = getCategory(user.major);
    const passesMajor = majorCategory === "All" || category === majorCategory;
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    const first = (user.first_name || "").toLowerCase();
    const last = (user.last_name || "").toLowerCase();
    const query = nameQuery.toLowerCase();
    const passesName =
      query === "" || first.startsWith(query) || last.startsWith(query);
    const passesState = stateFilter === "All" || user.hometown_state === stateFilter;
    const isHidden = hiddenMap[user.email];
    const passesHidden = showHidden ? isHidden : !isHidden;

    return passesStar && passesGpa && passesMajor && passesName && passesState && passesHidden;
      

  });

  const clearFilters = () => {
    setGpaFilter(0);
    setMajorCategory("All");
    setStateFilter("All");
    setNameQuery("");
    setFilterStarred(false);
    setShowHidden(false);
  };
  

  if (user === null) {
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
        <div className="flex gap-4 mb-6 items-start text-black">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">GPA</label>
            <div className="bg-white rounded-md">
              <input
                type="number"
                placeholder="Min GPA"
                value={gpaFilter}
                onChange={(e) => setGpaFilter(e.target.value)}
                className="px-2 py-1 rounded border"
                min="0"
                max="4"
                step="0.1"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">State</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-2 py-1 rounded border bg-white"
            >
              <option value="All">All States</option>
              {Array.from(new Set(users.map(user => user.hometown_state).filter(Boolean)))
                .sort()
                .map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
            </select>
          </div>


          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Major</label>
            <select
              value={majorCategory}
              onChange={(e) => setMajorCategory(e.target.value)}
              className="px-2 py-1 rounded border bg-white"
            >
              <option value="All">All Majors</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Arts and Science">Arts and Science</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col bg-wh">
            <label className="text-sm font-semibold mb-1">Search Name</label>
            <div className="bg-white rounded-md">
            <input
              type="text"
              placeholder="e.g. Philip"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              className="px-2 py-1 rounded border"
            />
            </div>
          </div>


          <div className="flex items-center mt-6">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={filterStarred}
                onChange={() => setFilterStarred(!filterStarred)}
              />
              Starred Only
            </label>
          </div>

          <div className="flex items-center mt-6 ml-4">
          <Link href="/prebid_list">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm shadow">
              Pre-Bid List
            </button>
          </Link>
        </div>

          <div className="flex items-center mt-6 ml-4">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={showHidden}
                onChange={() => setShowHidden(!showHidden)}
              />
              Show Hidden Users
            </label>
          </div>
        </div>

        

        <div className="flex items-end mt-2 mb-6">
          <button
            onClick={clearFilters}
            className="bg-red-500 hover:bg-red-600 text-white font-medium text-sm px-3 py-1.5 rounded shadow"
          >
            Clear Filters
          </button>
        </div>



        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mx-auto max-w-screen-xl px-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.email} // use stable key
                user={user}
                recruiterEmail={recruiterEmail}
                onMoreInfo={() => setSelectedUser(user)}
                onStarUpdate={handleStarUpdate}
                onHide={(email, isHidden) => {
                  setHiddenMap((prev) => {
                    const updated = { ...prev };
                    if (isHidden) {
                      updated[email] = true;
                    } else {
                      delete updated[email];
                    }
                    return updated;
                  });
                }}
                
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



