// "use client"; // Ensure this is a Client Component

// import { useEffect, useState } from "react";
// import Navbar from "./components/Nav"; 
// import Footer from "./components/footer";
// import Link from "next/link";
// import { signIn, signOut, useSession } from "next-auth/react";
// import "bootstrap-icons/font/bootstrap-icons.css";

// export default function HomePage() {
//   const [year, setYear] = useState(null);

//   // Fix Hydration Error by setting the current year on the client
//   useEffect(() => {
//     setYear(new Date().getFullYear());
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Reusable Navbar Component */}
//       <Navbar />

//       {/* Hero Section */}
    
//       <header className="hero">
//   <div className="hero-content">
//     <h1 className="hero-title">
//       Welcome to Hermes
//     </h1>
//     <p className="hero-subtitle">
//       Experience the power of seamless communication.
//     </p>
//   </div>
// </header>




//       {/* Main Content */}
//       <section className="container mx-auto px-6 py-10" data-aos="fade-up" data-aos-delay="100">
//         <h3 className="text-3xl font-bold text-center text-blue-900">What is IFC?</h3>
//         <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto mt-4">
//           The <strong>Interfraternity Council (IFC)</strong> governs and supports fraternities on campus, ensuring strong brotherhood, leadership, and service. Our platform allows fraternities to manage their events and share important updates with their members.
//         </p>
//       </section>

//       {/* Call to Action */}
//       <div className="text-center py-10">
//         <Link href="/information">
//           <button className="bg-blue-900 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
//             Learn More About IFC
//           </button>
//         </Link>
//       </div>

//       {/* Footer */}
//       <Footer />

//     </div>
//   );
// }








// // "use client";
// // import { useEffect, useState } from "react";
// // import { signIn, signOut, useSession } from "next-auth/react";
// // import Navbar from "./components/Nav";
// // import Link from "next/link";


// // export default function HomePage() {
// //     const { data: session } = useSession();
// //     const [userData, setUserData] = useState(null);


// //     useEffect(() => {
// //         if (session?.user) {
// //             fetch("/api/users")
// //                 .then((res) => res.json())
// //                 .then((data) => setUserData(data.find(user => user.email === session.user.email)))
// //                 .catch((err) => console.error("Error fetching user data", err));
// //         }
// //     }, [session]);


// //     return (
// //         <div className="min-h-screen bg-gray-100">
// //             <Navbar />


// //             <header className="text-center py-20 bg-blue-800 text-white">
// //                 <h2 className="text-4xl font-bold">Welcome to the IFC Fraternity Network</h2>
// //                 <p className="text-lg mt-4 max-w-2xl mx-auto">
// //                     A centralized platform for fraternities to post events, share updates, and connect with the community.
// //                 </p>
// //             </header>


// //             <section className="container mx-auto px-6 py-10">
// //                 <h3 className="text-3xl font-bold text-center text-blue-900">What is IFC?</h3>
// //                 <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto mt-4">
// //                     The **Interfraternity Council (IFC)** governs and supports fraternities on campus, ensuring strong brotherhood, leadership, and service.
// //                     Our platform allows fraternities to manage their events and share important updates with their members.
// //                 </p>
// //             </section>


// //             <div className="text-center py-10">
// //                 {session ? (
// //                     <div>
// //                         <p className="text-lg">Welcome, {session.user.email}!</p>
// //                         {userData ? (
// //                             <p className="text-lg text-green-600">You are registered in the database.</p>
// //                         ) : (
// //                             <p className="text-lg text-red-600">You are not registered yet.</p>
// //                         )}
// //                         <button
// //                             className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-red-500 transition mt-4"
// //                             onClick={() => signOut()}
// //                         >
// //                             Sign Out
// //                         </button>
// //                     </div>
// //                 ) : (
// //                 <button
// //                     className="bg-blue-900 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
// //                     onClick={() => signIn("google", { callbackUrl: "/" })} // ✅ This will take you to Google login directly
// //                 >
// //                     Sign in
// //                 </button>
// //                 )}
// //             </div>


// //             <footer className="bg-blue-900 text-white text-center py-4 mt-10">
// //                 &copy; {new Date().getFullYear()} IFC Fraternity Network. All Rights Reserved.
// //             </footer>
// //         </div>
// //     );
// // }




"use client"; // Ensure this is a Client Component

import { useEffect, useState } from "react";
import Navbar from "./components/Nav"; 
import Footer from "./components/footer";
import Link from "next/link";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function HomePage() {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to Hermes
          </h1>
          <p className="hero-subtitle">
            Experience the power of seamless communication.
          </p>
        </div>
      </header>

      {/* What is IFC Section */}
      <section className="container mx-auto px-6 py-10" data-aos="fade-up" data-aos-delay="100">
        <h3 className="text-3xl font-bold text-center text-blue-900">What is IFC?</h3>
        <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto mt-4">
          The <strong>Interfraternity Council (IFC)</strong> governs and supports fraternities on campus, ensuring strong brotherhood, leadership, and service. Our platform allows fraternities to manage their events and share important updates with their members.
        </p>
      </section>

      {/* Call to Action */}
      <div className="text-center py-10">
        <Link href="/information">
          <button className="bg-blue-900 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
            Learn More About IFC
          </button>
        </Link>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

