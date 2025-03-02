// "use client";

// import { useEffect, useState } from "react";
// import FratCard from "../components/FratCard";
// import FratModal from "../components/FratModal";

// export default function FratsPage() {
//   const [frats, setFrats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     const fetchFrats = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/api/getUserData"); // Ensure correct API URL
//         const data = await response.json();
//         setFrats(data);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFrats();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-5 transition-all">
//       <h1 className="text-3xl font-bold mb-6 text-black">Fraternities List</h1>

//       {loading ? (
//         <p>Loading frats...</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4">
//           {frats.map((user, index) => (
//             <FratCard key={index} user={user} onMoreInfo={() => setSelectedUser(user)} />
//           ))}
//         </div>
//       )}

//       {/* Show modal if a user is selected */}
//       {selectedUser && <FratModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import FratCard from "../components/FratCard";
import FratModal from "../components/FratModal";

export default function FratsPage() {
  const [frats, setFrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFrat, setSelectedFrat] = useState(null);

  useEffect(() => {
    const fetchFrats = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/getFratData"); // Ensure correct API URL
        const data = await response.json();
        setFrats(data);
      } catch (error) {
        console.error("Error fetching fraternities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFrats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-5 transition-all">
      <h1 className="text-3xl font-bold mb-6 text-black">Fraternities List</h1>

      {loading ? (
        <p>Loading fraternities...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4">
          {frats.map((frat, index) => ( // FIXED: changed 'user' to 'frat'
            <FratCard key={index} frat={frat} onMoreInfo={() => setSelectedFrat(frat)} />
          ))}
        </div>
      )}

      {/* Show modal if a fraternity is selected */}
      {selectedFrat && <FratModal frat={selectedFrat} onClose={() => setSelectedFrat(null)} />}
    </div>
  );
}


