// export default function FratCard({ frat, onMoreInfo }) {
//     if (!frat) return null; // Prevents rendering if frat is undefined
  
//     return (
//       <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center gap-6 w-80 h-96">
//         {/* Fraternity Logo - Bigger & Square */}
//         <img
//           src={frat.logoImage || "https://via.placeholder.com/200"}
//           alt={`${frat.name} Logo`}
//           className="w-40 h-40 object-cover border-4 border-gray-200 rounded-lg"
//         />

//         {/* Fraternity Name */}
//         <h2 className="text-2xl font-bold text-black text-center">{frat.name || "Unknown Fraternity"}</h2>
//         <p className="text-gray-600 text-center">{frat.address || "No address provided"}</p>

//         {/* More Info Button */}
//         <button
//           className="mt-4 text-lg text-blue-600 hover:underline cursor-pointer"
//           onClick={onMoreInfo}
//         >
//           + More information
//         </button>
//       </div>
//     );
// }


// // export default function FratCard({ frat, onMoreInfo }) {
// //     if (!frat) return null; // Prevents rendering if frat is undefined
  
// //     return (
// //       <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center gap-4 w-full">
// //         {/* Fraternity Logo */}
// //         <img
// //           src={frat.logoImage || "https://via.placeholder.com/150"}
// //           alt={`${frat.name} Logo`}
// //           className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
// //         />
  
// //         {/* Fraternity Name */}
// //         <h2 className="text-xl font-bold text-black text-center">{frat.name || "Unknown Fraternity"}</h2>
// //         <p className="text-gray-600">{frat.address || "No address provided"}</p>
  
// //         {/* More Info Button */}
// //         <button
// //           className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer"
// //           onClick={onMoreInfo}
// //         >
// //           + More information
// //         </button>
// //       </div>
// //     );
// //   }


// export default function FratCard({ frat, onMoreInfo }) {
//     if (!frat) return null; // Prevents rendering if frat is undefined
  
//     return (
//       <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center gap-6 w-80 h-96">
//         {/* Fraternity Logo - Bigger & Square */}
//         <img
//           src={frat.logoImage || "https://via.placeholder.com/200"}
//           alt={`${frat.name} Logo`}
//           className="w-40 h-40 object-cover border-4 border-gray-200 rounded-lg"
//           onError={(e) => e.target.src = "https://via.placeholder.com/200"} // Fallback if image fails
//         />

//         {/* Fraternity Name */}
//         <h2 className="text-2xl font-bold text-black text-center">{frat.name || "Unknown Fraternity"}</h2>
//         <p className="text-gray-600 text-center">{frat.address || "No address provided"}</p>

//         {/* More Info Button */}
//         <button
//           className="mt-4 text-lg text-blue-600 hover:underline cursor-pointer"
//           onClick={onMoreInfo}
//         >
//           + More information
//         </button>
//       </div>
//     );
// }

"use client";
import { motion } from "framer-motion";

export default function FratCard({ frat, onMoreInfo }) {
    if (!frat) return null; // Prevents rendering if frat is undefined

    return (
    // <div className="bg-gradient-to-b from-gray-100 to-gray-300 text-black rounded-xl shadow-md p-8 flex flex-col items-center gap-6 w-80 h-96 justify-between border border-gray-400">
    <motion.div
    className="bg-gradient-to-b from-gray-100 to-gray-300 text-black rounded-xl shadow-md p-8 flex flex-col items-center gap-6 w-80 h-96 justify-between border border-gray-400"
    whileHover={{ y: -10, scale: 1.03 }} // Moves up & scales slightly on hover
    transition={{ type: "spring", stiffness: 200, damping: 10 }} // Smooth motion
>
        {/* Fraternity Logo - Bigger & Square */}
        <img
          src={frat.logoImage || "https://via.placeholder.com/200"}
          alt={`${frat.name} Logo`}
          className="w-40 h-40 object-cover border-4 border-gray-200 rounded-lg"
          onError={(e) => e.target.src = "https://via.placeholder.com/200"} // Fallback if image fails
        />

        {/* Fraternity Info - Ensures Consistent Spacing */}
        <div className="flex flex-col flex-grow items-center justify-center">
          <h2 className="text-2xl font-bold text-black text-center">{frat.name || "Unknown Fraternity"}</h2>
          <p className="text-gray-600 text-center">{frat.address || "No address provided"}</p>
        </div>

        {/* More Info Button - Always at the Bottom */}
        <button
          className="text-lg text-blue-600 hover:underline cursor-pointer"
          onClick={onMoreInfo}
        >
          + More information
        </button>
      </motion.div>
    );
}


// "use client";
// import { MovingBorder } from "./ui/MovingBorder";

// export default function FratCard({ frat, onMoreInfo }) {
//   if (!frat) return null;

//   return (
//     <div className="relative">
//       <MovingBorder duration={8000} rx="20%" ry="20%">
//         <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center gap-6 w-80 h-96 justify-between relative overflow-hidden">
//           {/* Fraternity Logo - Bigger & Square */}
//           <img
//             src={frat.logoImage || "https://via.placeholder.com/200"}
//             alt={`${frat.name} Logo`}
//             className="w-40 h-40 object-cover border-4 border-gray-200 rounded-lg"
//             onError={(e) => (e.target.src = "https://via.placeholder.com/200")}
//           />

//           {/* Fraternity Info - Ensures Consistent Spacing */}
//           <div className="flex flex-col flex-grow items-center justify-center">
//             <h2 className="text-2xl font-bold text-black text-center">{frat.name || "Unknown Fraternity"}</h2>
//             <p className="text-gray-600 text-center">{frat.address || "No address provided"}</p>
//           </div>

//           {/* More Info Button - Always at the Bottom */}
//           <button className="text-lg text-blue-600 hover:underline cursor-pointer" onClick={onMoreInfo}>
//             + More information
//           </button>
//         </div>
//       </MovingBorder>
//     </div>
//   );
// }


