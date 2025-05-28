export default function FraternityModal({ frat, onClose }) {
    if (!frat) return null; // Prevents rendering if frat is undefined
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Increased modal width & height */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg shadow-xl p-10 w-4/5 h-auto relative border">
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
              {/* About Section */}
              <div className="bg-gray-100 p-6 rounded-lg mt-6 text-black">
                <h3 className="text-2xl font-bold mb-2">Core Values</h3>
                <p className="bg-gray-300 p-4 rounded-md">
                  {frat.values }
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg mt-6 text-black">
                <h3 className="text-2xl font-bold mb-2">About</h3>
                <p className="bg-gray-300 p-4 rounded-md">
                  {frat.about }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
