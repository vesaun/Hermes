// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import FratCard from "../components/FratCard";
// import FratModal from "../components/FratModal";
// import Navbar from "../components/Nav";
// import Footer from "../components/footer";

// export default function FratsPage() {
//   const { data: session, status } = useSession();
//   const [frats, setFrats] = useState([]);
//   const [starredMap, setStarredMap] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [selectedFrat, setSelectedFrat] = useState(null);
//   const [showStarredOnly, setShowStarredOnly] = useState(false);

//   const recruiterEmail = session?.user?.email;

//   useEffect(() => {
//     const fetchFrats = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/api/getFratData");
//         const data = await response.json();
//         setFrats(data);
//       } catch (error) {
//         console.error("Error fetching fraternities:", error);
//       }
//     };

//     const fetchStarred = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/api/getStarredFrats/${recruiterEmail}");
//         const data = await response.json();
//         setStarredMap(data); // { [frat_name]: { starred: true, note: "..." } }
//       } catch (error) {
//         console.error("Error fetching starred frats:", error);
//       }
//     };

//     if (recruiterEmail) {
//       fetchFrats();
//       fetchStarred().finally(() => setLoading(false));
//     }
//   }, [recruiterEmail]);

//   const handleStarUpdate = (fratName, starred, note) => {
//     setStarredMap((prev) => ({
//       ...prev,
//       [fratName]: { starred, note },
//     }));
//   };
  

//   const mergedFrats = frats.map((frat) => ({
//     ...frat,
//     starred: starredMap[frat.name]?.starred || false,
//     note: starredMap[frat.name]?.note || "",
//   }));

//   const filteredFrats = showStarredOnly
//     ? mergedFrats.filter((frat) => frat.starred)
//     : mergedFrats;

//   if (status === "loading") {
//     return <p className="text-center mt-20 text-black">Loading session...</p>;
//   }

//   if (!session) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B] flex items-center justify-center">
//         <div className="text-center text-white">
//           <h2 className="text-3xl mb-4">You are not signed in.</h2>
//           <Link
//             href="/"
//             className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md"
//           >
//             Go Home
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white flex flex-col items-center p-5 transition-all">

//         {/* ⭐ Toggle Button */}
//         <button
//           onClick={() => setShowStarredOnly(!showStarredOnly)}
//           className="mb-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           {showStarredOnly ? "Show All Fraternities" : "Show Starred Only"}
//         </button>

//         {loading ? (
//           <p>Loading fraternities...</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4">
//             {filteredFrats.map((frat, index) => (
//               <FratCard
//                 key={index}
//                 frat={frat}
//                 recruiterEmail={recruiterEmail}
//                 onMoreInfo={() => setSelectedFrat(frat)}
//                 onStarUpdate={handleStarUpdate} // Pass the handler to FratCard
//               />
//             ))}
//           </div>
//         )}

//         {selectedFrat && (
//           <FratModal frat={selectedFrat} onClose={() => setSelectedFrat(null)} />
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import FratCard from "../components/FratCard";
import FratModal from "../components/FratModal";
import Navbar from "../components/Nav";
import Footer from "../components/footer";
import Link from "next/link";

export default function FratsPage() {
  const [user, setUser] = useState(null);
  const [frats, setFrats] = useState([]);
  const [starredMap, setStarredMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFrat, setSelectedFrat] = useState(null);
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  const recruiterEmail = user?.email;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFrats = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/getFratData");
        const data = await response.json();
        setFrats(data);
      } catch (error) {
        console.error("Error fetching fraternities:", error);
      }
    };

    const fetchStarred = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/getStarredFrats/${recruiterEmail}`);
        const data = await response.json();
        setStarredMap(data);
      } catch (error) {
        console.error("Error fetching starred frats:", error);
      }
    };

    if (recruiterEmail) {
      fetchFrats();
      fetchStarred().finally(() => setLoading(false));
    }
  }, [recruiterEmail]);

  const handleStarUpdate = (fratName, starred, note) => {
    setStarredMap((prev) => ({
      ...prev,
      [fratName]: { starred, note },
    }));
  };

  const mergedFrats = frats.map((frat) => ({
    ...frat,
    starred: starredMap[frat.name]?.starred || false,
    note: starredMap[frat.name]?.note || "",
  }));

  const filteredFrats = showStarredOnly
    ? mergedFrats.filter((frat) => frat.starred)
    : mergedFrats;

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
        {/* ⭐ Toggle Button */}
        <button
          onClick={() => setShowStarredOnly(!showStarredOnly)}
          className="mb-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showStarredOnly ? "Show All Fraternities" : "Show Starred Only"}
        </button>

        {loading ? (
          <p>Loading fraternities...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4">
            {filteredFrats.map((frat, index) => (
              <FratCard
                key={index}
                frat={frat}
                recruiterEmail={recruiterEmail}
                onMoreInfo={() => setSelectedFrat(frat)}
                onStarUpdate={handleStarUpdate}
              />
            ))}
          </div>
        )}

        {selectedFrat && (
          <FratModal frat={selectedFrat} onClose={() => setSelectedFrat(null)} />
        )}
      </div>
      <Footer />
    </>
  );
}
