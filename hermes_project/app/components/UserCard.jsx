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
  


export default function UserCard({ user, onMoreInfo }) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 flex gap-4 w-full items-center">
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
      </div>
    );
  }
  
  