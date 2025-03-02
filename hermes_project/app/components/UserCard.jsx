// export default function UserCard({ user }) {
//     return (
//       <div className="bg-white rounded-xl shadow-md p-6 flex gap-4 w-full items-center">
//         {/* Placeholder Image (Replace with Firestore image if available) */}
//         <img
//           src="https://via.placeholder.com/150"
//           alt={user.firstname}
//           className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
//         />
  
//         {/* User Info */}
//         <div>
//           <h2 className="text-xl font-bold text-black">{user.firstname} {user.lastname}</h2>
//           <p className="text-gray-600">{user.hometown}</p>
//           <p className="text-gray-500">{user.major}</p>
  
//           {/* More Info Button */}
//           <button className="mt-2 text-sm text-blue-600 hover:underline">
//             + More information
//           </button>
//         </div>
//       </div>
//     );
//   }
  
"use client";
import { motion } from "framer-motion";


export default function UserCard({ user, onMoreInfo }) {
    return (
      // <div className="bg-white rounded-xl shadow-md p-6 flex gap-4 w-full items-center">
      // <div className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg shadow-xl p-10 w-4/5 h-auto relative border">
      <motion.div
      className="bg-gradient-to-b from-gray-100 to-gray-300 text-black rounded-xl shadow-md p-8 flex flex-col items-center gap-6 w-80 h-96 justify-between border border-gray-400"
      whileHover={{ y: -10, scale: 1.03 }} // Moves up & scales slightly on hover
      transition={{ type: "spring", stiffness: 200, damping: 10 }} // Smooth motion
      >
        {/* Placeholder Image (Replace with Firestore image if available) */}
        <img
          src="https://via.placeholder.com/150"
          alt={user.firstname}
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
        />
  
        {/* User Info */}
        <div>
          <h2 className="text-xl font-bold text-black">{user.firstname} {user.lastname}</h2>
          <p className="text-gray-600">{user.hometown}</p>
          <p className="text-gray-500">{user.major}</p>
  
          {/* More Info Button */}
          <button
            className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer"
            onClick={onMoreInfo}
          >
            + More information
          </button>
        </div>
      </motion.div>
    );
  }
  
  