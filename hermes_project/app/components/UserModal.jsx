// export default function UserModal({ user, onClose }) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center z-50">
//         {/* Background Overlay Removed */}
        
//         <div className="bg-white rounded-lg shadow-xl p-6 w-1/3 relative border">
//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
//           >
//             ✖
//           </button>
  
//           {/* User Profile Info */}
//           <div className="flex flex-col items-center">
//             <img
//               src="https://via.placeholder.com/150"
//               alt={user.firstname}
//               className="w-24 h-24 rounded-full border-4 border-gray-200 mb-4"
//             />
//             <h2 className="text-2xl font-bold">{user.firstname} {user.lastname}</h2>
//             <p className="text-gray-600 mt-2">Hometown: {user.hometown}</p>
//             <p className="text-gray-600 mt-1">Major: {user.major}</p>
  
//             {/* Additional Details */}
//             <div className="mt-4">
//               <p className="text-gray-500">More details about this user...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }


// export default function UserModal({ user, onClose }) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg shadow-xl p-8 w-3/5 h-3/4 relative border">
//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
//           >
//             ✖
//           </button>
  
//           {/* User Profile Info */}
//           <div className="flex flex-col items-center">
//             <img
//               src="https://via.placeholder.com/200"
//               alt={user.firstname}
//               className="w-32 h-32 rounded-full border-4 border-gray-200 mb-6"
//             />
//             <h2 className="text-3xl font-bold">{user.firstname} {user.lastname}</h2>
//             <p className="text-gray-600 mt-2 text-lg">Hometown: {user.hometown}</p>
//             <p className="text-gray-600 mt-1 text-lg">Major: {user.major}</p>
  
//             {/* Additional Details */}
//             <div className="mt-6 text-center">
//               <p className="text-gray-500 text-lg">More details about this user...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

export default function UserModal({ user, onClose }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 w-3/4 h-auto relative border">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl cursor-pointer"
          >
            ✖
          </button>
  
          <div className="grid grid-cols-3 gap-6">
            {/* Left Sidebar (Profile & Basic Info) */}
            <div className="col-span-1 bg-gray-100 p-6 rounded-lg">
              {/* Profile Picture Placeholder */}
              <div className="flex justify-center mb-4">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-gray-300"
                />
              </div>
              <h2 className="text-2xl font-bold text-center text-black">{user.firstname} {user.lastname}</h2>
  
              <div className="mt-6 space-y-4">
                <p className="bg-gray-200 p-3 rounded-md text-black"><strong>High School:</strong> {user.highschool} </p>
                <p className="bg-gray-200 p-3 rounded-md text-black"><strong>Hometown:</strong> {user.hometown_city}, {user.hometown_state}</p>
                <p className="bg-gray-200 p-3 rounded-md text-black"><strong>GPA:</strong> {user.gpa} </p>
              </div>
            </div>
  
            {/* Right Section (Detailed Information) */}
            <div className="col-span-2 text-black">
              <h2 className="text-xl font-bold mb-4 text-black">About</h2>
              <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
                <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
                <p><strong>Phone Number:</strong> 303-862-2531</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>College Major:</strong> {user.major}</p>
                <p><strong>Instagram:</strong> @{user.instagram_username}</p>
              </div>
  
              {/* High School Details */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold">High School Sports</h3>
                  <p className="bg-gray-300 p-2 rounded-md mt-2">...</p>
                </div>
  
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold">High School Involvement</h3>
                  <p className="bg-gray-300 p-2 rounded-md mt-2">...</p>
                </div>
              </div>
  
              {/* Interest in Rushing */}
              <div className="bg-gray-100 p-4 rounded-lg mt-6">
                <h3 className="font-bold">Why are you Interested in Rushing?</h3>
                <p className="bg-gray-300 p-2 rounded-md mt-2">...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  
  