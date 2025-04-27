export default function UserModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg shadow-xl p-10 w-4/5 h-auto relative border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl cursor-pointer"
        >
          ✖
        </button>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-1 bg-gray-100 p-6 rounded-lg">
            <div className="flex justify-center mb-4">
              <img
                src={user.headshot || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-center text-black">{user.firstname} {user.lastname}</h2>

            <div className="mt-6 space-y-4">
              <p className="bg-gray-200 p-3 rounded-md text-black"><strong>Hometown:</strong> {user.hometown_city}</p>
              <p className="bg-gray-200 p-3 rounded-md text-black"><strong>GPA:</strong> {user.gpa}</p>
              <p className="bg-gray-200 p-3 rounded-md text-black"><strong>College Major:</strong> {user.major}</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-span-2 text-black">
            <h2 className="text-xl font-bold mb-4 text-black">About</h2>
            <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
              {/* <p><strong>Name:</strong> {user.firstname} {user.lastname}</p> */}
              <p><strong>Phone Number:</strong> {formatPhoneNumber(user.phone_number)}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>High School:</strong> {user.highschool}</p>
              <p>
                <strong>Instagram:</strong>{" "}
                {user.instagram_username ? (
                  <a
                    href={`https://instagram.com/${user.instagram_username.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    @{user.instagram_username.replace(/^@/, "")}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>

            {/* High School Details */}
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

            {/* Rush Interest */}
            <div className="bg-gray-100 p-4 rounded-lg mt-6">
              <h3 className="font-bold">Why are you Interested in Rushing?</h3>
              <p className="bg-gray-300 p-2 rounded-md mt-2">{user.rush_interest || 'N/A'}</p>
            </div>
          </div>
        </div>
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

  
  
  