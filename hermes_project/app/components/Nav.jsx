"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-900 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          IFC Fraternity Network
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/about" className="hover:text-gray-300">About</Link>
          <Link href="/information" className="hover:text-gray-300">Information</Link>


          {/* Conditionally Render Login/Logout */}
          {session ? (
            // If the user is logged in, show only ONE Sign Out button
            <button
              onClick={() => signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            // If the user is NOT logged in, show both Register and Log In buttons
            <div className="flex space-x-4">
              <button
                onClick={() => signIn("google", { callbackUrl: "/signup" })}
                className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                Register
              </button>
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 text-center py-4">
          <Link href="/" className="block py-2 hover:text-gray-300" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" className="block py-2 hover:text-gray-300" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/information" className="block py-2 hover:text-gray-300" onClick={() => setMenuOpen(false)}>Information</Link>
          {/* Mobile Log In Button */}
          {session ? (
            <button
              onClick={() => signOut()}
              className="block py-2 bg-red-600 text-white px-4 py-2 mx-auto w-fit rounded-lg hover:bg-red-500"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="block py-2 bg-white text-blue-900 px-4 py-2 mx-auto w-fit rounded-lg hover:bg-gray-200"
            >
              Log In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}


// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { signIn, signOut, useSession } from "next-auth/react";


// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const { data: session } = useSession();


//   return (
//     <nav className="bg-blue-900 text-white py-4 shadow-lg">
//       <div className="container mx-auto flex justify-between items-center px-6">
//         {/* Logo */}
//         <Link href="/" className="text-2xl font-bold">
//           IFC Fraternity Network
//         </Link>


//         {/* Desktop Menu */}
//         <div className="hidden md:flex space-x-6">
//           <Link href="/" className="hover:text-gray-300">Home</Link>
//           <Link href="/about" className="hover:text-gray-300">About</Link>
//           <Link href="/information" className="hover:text-gray-300">Information</Link>


//           {/* Conditionally Render Login/Logout */}
//           {session ? (
//             <button
//               onClick={() => signOut()}
//               className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
//             >
//               Sign Out
//             </button>
//           ) : (
//             <button
//               onClick={() => signIn("google", { callbackUrl: "/" })}
//               className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200"
//             >
//               Log In
//             </button>
//           )}
//         </div>
//       </div>


//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden bg-blue-800 text-center py-4">
//           <Link href="/" className="block py-2 hover:text-gray-300" onClick={() => setMenuOpen(false)}>Home</Link>
//           <Link href="/about" className="block py-2 hover:text-gray-300" onClick={() => setMenuOpen(false)}>About</Link>
//           <Link href="/information" className="block py-2 hover:text-gray-300" onClick={() => setMenuOpen(false)}>Information</Link>


//           {/* Mobile Log In Button */}
//           {session ? (
//             <button
//               onClick={() => signOut()}
//               className="block py-2 bg-red-600 text-white px-4 py-2 mx-auto w-fit rounded-lg hover:bg-red-500"
//             >
//               Sign Out
//             </button>
//           ) : (
//             <button
//               onClick={() => signIn("google", { callbackUrl: "/" })}
//               className="block py-2 bg-white text-blue-900 px-4 py-2 mx-auto w-fit rounded-lg hover:bg-gray-200"
//             >
//               Log In
//             </button>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// }

