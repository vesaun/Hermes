// export default function FraternityModal({ frat, onClose }) {
//     if (!frat) return null; // Prevents rendering if frat is undefined
  
//     return (
//       <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
//         <div className="bg-white rounded-lg shadow-xl p-8 w-3/5 h-auto relative border">
//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
//           >
//             ✖
//           </button>
  
//           <div className="grid grid-cols-3 gap-6">
//             {/* Left Sidebar (Fraternity Images) */}
//             <div className="col-span-1 bg-gray-100 p-6 rounded-lg">
//               {/* Fraternity House Image */}
//               <div className="mb-4 text-black">
//                 <img
//                   src={frat.houseImage || "https://via.placeholder.com/300x200"}
//                   alt={`${frat.name || "Fraternity"} House`}
//                   className="w-full h-40 object-cover rounded-lg"
//                 />
//               </div>
  
//               {/* Fraternity Logo */}
//               <div className="flex justify-center">
//                 <img
//                   src={frat.logoImage || "https://via.placeholder.com/100"}
//                   alt={`${frat.name || "Fraternity"} Logo`}
//                   className="w-24 h-24 object-cover border-4 border-gray-300 rounded-full"
//                 /> 
//               </div>
//             </div>
  
//             {/* Right Section (Detailed Information) */}
//             <div className="col-span-2">
//               <h2 className="text-2xl font-bold text-black">{frat.name || "Unknown Fraternity"}</h2>
//               <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg mt-4 text-black">
//                 <p><strong>Founded:</strong> {frat.year_founded || "N/A"}</p>
//                 <p><strong>Address:</strong> {frat.address || "No address provided"}</p>
//                 <p><strong>Member Count:</strong> {frat.member_count || "Unknown"}</p>
//                 <p><strong>Instagram:</strong> <a href={frat.instagram_username || "#"} className="text-blue-500 underline" target="_blank">{frat.instagram_username || "No Instagram"}</a></p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
  
export default function FraternityModal({ frat, onClose }) {
    if (!frat) return null; // Prevents rendering if frat is undefined
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Increased modal width & height */}
        <div className="bg-white rounded-lg shadow-xl p-10 w-4/5 h-auto relative border">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-black text-3xl cursor-pointer"
          >
            ✖
          </button>

          <div className="grid grid-cols-3 gap-8">
            {/* Left Sidebar (Fraternity Images) */}
            <div className="col-span-1 bg-gray-100 p-6 rounded-lg">
              {/* Fraternity House Image */}
              <div className="mb-4">
                <img
                  src={frat.houseImage || "https://via.placeholder.com/400x250"}
                  alt={`${frat.name || "Fraternity"} House`}
                  className="w-full h-52 object-cover rounded-lg"
                />
              </div>

              {/* Fraternity Logo */}
              <div className="flex justify-center">
                <img
                  src={frat.logoImage || "https://via.placeholder.com/120"}
                  alt={`${frat.name || "Fraternity"} Logo`}
                  className="w-32 h-32 object-cover border-4 border-gray-300 rounded-full"
                /> 
              </div>
            </div>

            {/* Right Section (Detailed Information) */}
            <div className="col-span-2">
              <h2 className="text-3xl font-bold text-black">{frat.name || "Unknown Fraternity"}</h2>
              <div className="grid grid-cols-2 gap-6 bg-gray-100 p-6 rounded-lg mt-6 text-black text-lg">
                <p><strong>Founded:</strong> {frat.year_founded || "N/A"}</p>
                <p><strong>Address:</strong> {frat.address || "No address provided"}</p>
                <p><strong>Member Count:</strong> {frat.member_count || "Unknown"}</p>
                <p><strong>Instagram:</strong>  
                  <a href={frat.instagram_username || "#"} 
                     className="text-blue-500 underline ml-1" 
                     target="_blank" 
                     rel="noopener noreferrer">
                    Instagram
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
