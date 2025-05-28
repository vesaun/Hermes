// import { useState } from 'react';

// export default function UserModal({ user, onClose }) {
//   const [showPreBidModal, setShowPreBidModal] = useState(false);
//   const [selectedFrat, setSelectedFrat] = useState("");
//   const [confirming, setConfirming] = useState(false);

//   const handlePreBidConfirm = async () => {
//     const res = await fetch('http://localhost:8080/api/prebidUser', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         user_email: user.email,
//         fraternity_id: selectedFrat
//       }),
//     });

//     const result = await res.json();
//     if (res.ok) {
//       alert("✅ Pre-Bid successful!");
//       setShowPreBidModal(false);
//       setConfirming(false);
//       onClose();
//     } else {
//       alert("❌ Failed to Pre-Bid: " + result.error);
//     }
//   };


//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       <div className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg shadow-xl p-10 w-4/5 h-auto relative border">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl cursor-pointer"
//         >
//           ✖
//         </button>

//         <div className="grid grid-cols-3 gap-6">
//           {/* Left Sidebar */}
//           <div className="col-span-1 bg-gray-100 p-6 rounded-lg">
//             <div className="flex justify-center mb-4">
//               <img
//                 src={user.headshot || "https://via.placeholder.com/150"}
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
//               />
//             </div>
//             <h2 className="text-2xl font-bold text-center text-black">{user.firstname} {user.lastname}</h2>

//             <div className="mt-6 space-y-4">
//               <p className="bg-gray-200 p-3 rounded-md text-black"><strong>Hometown:</strong> {user.hometown_city}</p>
//               <p className="bg-gray-200 p-3 rounded-md text-black"><strong>State:</strong> {user.hometown_state}</p>
//               <p className="bg-gray-200 p-3 rounded-md text-black"><strong>GPA:</strong> {user.gpa}</p>
//               <p className="bg-gray-200 p-3 rounded-md text-black"><strong>College Major:</strong> {user.major}</p>
//             </div>
//           </div>

//           {/* Right Section */}
//           <div className="col-span-2 text-black">
//             <h2 className="text-xl font-bold mb-4 text-black">About</h2>
//             <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
//               {/* <p><strong>Name:</strong> {user.firstname} {user.lastname}</p> */}
//               <p><strong>Phone Number:</strong> {formatPhoneNumber(user.phone_number)}</p>
//               <p><strong>Email:</strong> {user.email}</p>
//               <p><strong>High School:</strong> {user.highschool}</p>
//               <p>
//                 <strong>Instagram:</strong>{" "}
//                 {user.instagram_handle ? (
//                   <a
//                     href={`https://instagram.com/${user.instagram_handle.replace(/^@/, "")}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline"
//                   >
//                     @{user.instagram_handle.replace(/^@/, "")}
//                   </a>
//                 ) : (
//                   "N/A"
//                 )}
//               </p>
//             </div>

//             {/* High School Details */}
//             <div className="grid grid-cols-2 gap-4 mt-6">
//               <div className="bg-gray-100 p-4 rounded-lg">
//                 <h3 className="font-bold">High School Activities</h3>
//                 <p className="bg-gray-300 p-2 rounded-md mt-2">{user.hs_activities || 'N/A'}</p>
//               </div>

//               <div className="bg-gray-100 p-4 rounded-lg">
//                 <h3 className="font-bold">High School Accomplishments</h3>
//                 <p className="bg-gray-300 p-2 rounded-md mt-2">{user.hs_accomplishments || 'N/A'}</p>
//               </div>
//             </div>

//             {/* Rush Interest */}
//             <div className="bg-gray-100 p-4 rounded-lg mt-6">
//               <h3 className="font-bold">Why are you Interested in Rushing?</h3>
//               <p className="bg-gray-300 p-2 rounded-md mt-2">{user.rush_interest || 'N/A'}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// function formatPhoneNumber(phoneNumber) {
//   if (!phoneNumber) return "N/A";
//   const cleaned = ('' + phoneNumber).replace(/\D/g, '');
//   const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
//   if (match) {
//     return `${match[1]}-${match[2]}-${match[3]}`;
//   }
//   return phoneNumber;
// }

  
  
  
'use client';
import { useState } from 'react';

export default function UserModal({ user, onClose }) {
  const [showPreBidModal, setShowPreBidModal] = useState(false);
  const [selectedFrat, setSelectedFrat] = useState("");
  const [confirming, setConfirming] = useState(false);

  const handlePreBidConfirm = async () => {
    const res = await fetch('http://localhost:8080/api/prebidUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_email: user.email,
        fraternity_id: selectedFrat
      }),
    });

    const result = await res.json();
    if (res.ok) {
      alert("✅ Pre-Bid successful!");
      setShowPreBidModal(false);
      setConfirming(false);
      onClose();
    } else {
      alert("❌ Failed to Pre-Bid: " + result.error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg shadow-xl p-10 w-4/5 h-auto relative border">

        {/* Top right buttons */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <button
            className="text-gray-600 hover:text-black text-xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            ✖
          </button>
        </div>
        <div className="inbetween flex justify-between mb-6">
          <button
            onClick={() => setShowPreBidModal(true)}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
          >
            Pre-Bid
          </button>
        </div>

        {/* Profile content */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 bg-gray-100 p-6 rounded-lg">
            <div className="flex justify-center mb-4">
              <img
                src={user.headshot || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-center text-black">
              {user.firstname} {user.lastname}
            </h2>

            <div className="mt-6 space-y-4">
              <p className="bg-gray-200 p-3 rounded-md text-black"><strong>Hometown:</strong> {user.hometown_city}</p>
              <p className="bg-gray-200 p-3 rounded-md text-black"><strong>State:</strong> {user.hometown_state}</p>
              <p className="bg-gray-200 p-3 rounded-md text-black"><strong>GPA:</strong> {user.gpa}</p>
              <p className="bg-gray-200 p-3 rounded-md text-black"><strong>College Major:</strong> {user.major}</p>
            </div>
          </div>

          <div className="col-span-2 text-black">
            <h2 className="text-xl font-bold mb-4">About</h2>
            <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
              <p><strong>Phone Number:</strong> {formatPhoneNumber(user.phone_number)}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>High School:</strong> {user.highschool}</p>
              <p>
                <strong>Instagram:</strong>{" "}
                {user.instagram_handle ? (
                  <a
                    href={`https://instagram.com/${user.instagram_handle.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    @{user.instagram_handle.replace(/^@/, "")}
                  </a>
                ) : "N/A"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold">High School Activities</h3>
                <p className="bg-gray-300 p-2 rounded-md mt-2">{user.hs_activities || 'N/A'}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold">High School Accomplishments</h3>
                <p className="bg-gray-300 p-2 rounded-md mt-2">{user.hs_accomplishments || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mt-6">
              <h3 className="font-bold">Why are you Interested in Rushing?</h3>
              <p className="bg-gray-300 p-2 rounded-md mt-2">{user.rush_interest || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Pre-Bid Modal */}
        {/* {showPreBidModal && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 relative"> */}
          {showPreBidModal && (
            <div
              className="fixed inset-0 flex justify-center items-center z-50"
              onClick={() => {
                setShowPreBidModal(false);
                setConfirming(false);
                setSelectedFrat("");
              }}
            >
              <div
                className="bg-white rounded-lg p-6 w-96 relative"
                onClick={(e) => e.stopPropagation()}
              >

              <button
                onClick={() => {
                  setShowPreBidModal(false);
                  setConfirming(false);
                  setSelectedFrat("");
                }}
                className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
              >
                ✖
              </button>

              {!confirming ? (
                <>
                  <h2 className="text-lg font-semibold mb-4 text-black">Select Fraternity</h2>
                  <select
                    value={selectedFrat}
                    onChange={(e) => setSelectedFrat(e.target.value)}
                    className="w-full border p-2 mb-4 text-black"
                  >
                    <option value="">-- Choose Fraternity --</option>
                    <option value="acacia">Acacia</option>
                    <option value="alpha_delta_phi">Alpha Delta Phi</option>
                    <option value="alpha_epsilon_pi">Alpha Epsilon Pi</option>
                    <option value="alpha_gamma_omega">Alpha Gamma Omega</option>
                    <option value="alpha_phi_delta">Alpha Phi Delta</option>
                    <option value="alpha_kappa_lambda">Alpha Kappa Lambda</option>
                    <option value="alpha_sigma_phi">Alpha Sigma Phi</option>
                    <option value="alpha_tau_omega">Alpha Tau Omega</option>
                    <option value="chi_psi">Chi Psi</option>
                    <option value="delta_kappa_epsilon">Delta Kappa Epsilon</option>
                    <option value="kappa_alpha_order">Kappa Alpha Order</option>
                    <option value="phi_kappa_psi">Phi Kappa Psi</option>
                    <option value="phi_gamma_delta">Phi Gamma Delta</option>
                    <option value="phi_kappa_alpha">Phi Kappa Alpha</option>
                    <option value="pi_kappa_phi">Pi Kappa Phi</option>
                    <option value="sigma_alpha_epsilon">Sigma Alpha Epsilon</option>
                    <option value="sigma_nu">Sigma Nu</option>
                    <option value="tau_kappa_epsilon">Tau Kappa Epsilon</option>
                    <option value="theta_chi">Theta Chi</option>
                    <option value="theta_xi">Theta Xi</option>
                    <option value="zeta_beta_tau">Zeta Beta Tau</option>
                  </select>

                  <button
                    disabled={!selectedFrat}
                    onClick={() => setConfirming(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Confirm Selection
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-4 text-black">
                    Are you sure you want to Pre-Bid this user to <strong>{selectedFrat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</strong>
                    ?
                  </h2>
                  <div className="flex justify-end gap-2">
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                      onClick={() => setShowPreBidModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePreBidConfirm}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Yes, Pre-Bid
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return "N/A";
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}

