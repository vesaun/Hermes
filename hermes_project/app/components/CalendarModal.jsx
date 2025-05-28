// 'use client';
// import { useState, useEffect } from 'react';
// import { auth } from '@/lib/firebase';

// export default function CalendarModal({ event, onClose, isAdmin }) {
//   const [form, setForm] = useState({
//     title: event.title || '',
//     description: event.description || '',
//     date: event.date || '',
//     start_time: event.start_time || '',
//     end_time: event.end_time || '',
//     address: event.address || '',
//   });

//   const [currentUserEmail, setCurrentUserEmail] = useState('');

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) setCurrentUserEmail(user.email);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const [isStarred, setIsStarred] = useState(false);

//     // Load star state on modal open
//     useEffect(() => {
//     const fetchStarStatus = async () => {
//         if (currentUserEmail && event.id) {
//         const res = await fetch(`http://localhost:8080/api/getStarredEvents/${currentUserEmail}`);
//         const data = await res.json();
//         setIsStarred(data[event.id]?.starred || false);
//         }
//     };
//     fetchStarStatus();
//     }, [currentUserEmail, event.id]);

//     const handleStarToggle = async () => {
//         const newState = !isStarred;
//         setIsStarred(newState);
      
//         await fetch("http://localhost:8080/api/starEvent", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             user_email: currentUserEmail,
//             event_id: event.id,
//             starred: newState,
//           }),
//         });
//       };
      


//   const handleSubmit = async () => {
//     const method = event.id ? 'PUT' : 'POST';
//     const endpoint = event.id ? `/api/updateEvent/${event.id}` : '/api/addEvent';

//     await fetch(`http://localhost:8080${endpoint}`, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });

//     onClose();
//     window.location.reload();
//   };

//   const handleDelete = async () => {
//     const confirmDelete = confirm('Are you sure you want to delete this event?');
//     if (!confirmDelete) return;

//     await fetch(`http://localhost:8080/api/deleteEvent/${event.id}`, {
//       method: 'DELETE',
//     });

//     onClose();
//     window.location.reload();
//   };

//   function formatTime(timeString) {
//     if (!timeString) return '';
//     const [hour, minute] = timeString.split(':');
//     const date = new Date();
//     date.setHours(parseInt(hour), parseInt(minute));
//     return date.toLocaleTimeString([], {
//       hour: 'numeric',
//       minute: '2-digit',
//     });
//   }

//   const isCreator = currentUserEmail === event.email;

//   return (
//     <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
//       <div className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg p-6 w-full max-w-md text-black">
//         {/* <h2 className="text-2xl font-semibold mb-4">
//           {event.title ? 'Event Details' : 'Add New Event'}
//         </h2> */}

//         <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-semibold">Event Details</h2>
//             <button onClick={handleStarToggle}>
//                 <span className={`text-2xl ${isStarred ? "text-yellow-400" : "text-gray-400"}`}>★</span>
//             </button>
//         </div>


//         <input
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//           placeholder="Title"
//           className="w-full mb-2 p-2 border rounded"
//         />
//         <input
//           name="date"
//           value={form.date}
//           onChange={handleChange}
//           placeholder="YYYY-MM-DD"
//           className="w-full mb-2 p-2 border rounded"
//         />
//         <input
//           name="time"
//           value={
//             form.start_time && form.end_time
//               ? `${formatTime(form.start_time)} - ${formatTime(form.end_time)}`
//               : ''
//           }
//           disabled
//           className="w-full mb-2 p-2 border rounded"
//         />
//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           placeholder="Description"
//           className="w-full mb-2 p-2 border rounded"
//         />
//         <textarea
//           name="address"
//           value={form.address}
//           onChange={handleChange}
//           placeholder="Address"
//           className="w-full mb-2 p-2 border rounded"
//         />

//         <div className="flex justify-end gap-2 mt-4">
//           <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
//             Cancel
//           </button>

//           {isCreator && (
//             <>
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded"
//                 onClick={handleSubmit}
//               >
//                 {event.title ? 'Update' : 'Add'}
//               </button>
//               <button
//                 className="bg-red-600 text-white px-4 py-2 rounded"
//                 onClick={handleDelete}
//               >
//                 Delete
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





// 'use client';
// import { useState, useEffect } from 'react';
// import { auth } from '@/lib/firebase';

// export default function CalendarModal({ event, onClose, isAdmin }) {
//   const [form, setForm] = useState({
//     title: event.title || '',
//     description: event.description || '',
//     date: event.date || '',
//     start_time: event.start_time || '',
//     end_time: event.end_time || '',
//     address: event.address || '',
//   });

//   const [currentUserEmail, setCurrentUserEmail] = useState('');
//   const [isStarred, setIsStarred] = useState(false);

//   // Fetch current user
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) setCurrentUserEmail(user.email);
//     });
//     return () => unsubscribe();
//   }, []);

//   // Fetch star status
//   useEffect(() => {
//     const fetchStarStatus = async () => {
//       if (currentUserEmail && event.id) {
//         const res = await fetch(`http://localhost:8080/api/getStarredEvents/${currentUserEmail}`);
//         const data = await res.json();
//         setIsStarred(data[event.id]?.starred || false);
//       }
//     };
//     fetchStarStatus();
//   }, [currentUserEmail, event.id]);

//   const handleClickOutside = (e) => {
//     if (modalRef.current && !modalRef.current.contains(e.target)) {
//       onClose();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     const method = event.id ? 'PUT' : 'POST';
//     const endpoint = event.id ? `/api/updateEvent/${event.id}` : '/api/addEvent';

//     await fetch(`http://localhost:8080${endpoint}`, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });

//     onClose();
//     window.location.reload();
//   };

//   const handleDelete = async () => {
//     const confirmDelete = confirm('Are you sure you want to delete this event?');
//     if (!confirmDelete) return;

//     await fetch(`http://localhost:8080/api/deleteEvent/${event.id}`, {
//       method: 'DELETE',
//     });

//     onClose();
//     window.location.reload();
//   };

//   const handleStarToggle = async () => {
//     const newState = !isStarred;
//     setIsStarred(newState);

//     await fetch("http://localhost:8080/api/starEvent", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         user_email: currentUserEmail,
//         event_id: event.id,
//         starred: newState,
//       }),
//     });
//   };

//   function formatTime(timeString) {
//     if (!timeString) return '';
//     const [hour, minute] = timeString.split(':');
//     const date = new Date();
//     date.setHours(parseInt(hour), parseInt(minute));
//     return date.toLocaleTimeString([], {
//       hour: 'numeric',
//       minute: '2-digit',
//     });
//   }

//   const isCreator = currentUserEmail === event.email;

//   return (
//     <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
//       <div className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg p-6 w-full max-w-md text-black relative">
//         {/* Star Button */}
//         <button
//           onClick={handleStarToggle}
//           className="absolute top-4 right-4 text-2xl"
//         >
//           <span className={isStarred ? 'text-yellow-400' : 'text-gray-400'}>★</span>
//         </button>

//         <h2 className="text-2xl font-semibold mb-4">
//           {event.title ? 'Event Details' : 'Add New Event'}
//         </h2>

//         <input
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//           placeholder="Title"
//           className="w-full mb-2 p-2 border rounded"
//         />
//         <input
//           name="date"
//           value={form.date}
//           onChange={handleChange}
//           placeholder="YYYY-MM-DD"
//           className="w-full mb-2 p-2 border rounded"
//         />
//         <input
//           name="time"
//           value={
//             form.start_time && form.end_time
//               ? `${formatTime(form.start_time)} - ${formatTime(form.end_time)}`
//               : ''
//           }
//           disabled
//           className="w-full mb-2 p-2 border rounded"
//         />
//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           placeholder="Description"
//           className="w-full mb-2 p-2 border rounded"
//         />
//         <textarea
//           name="address"
//           value={form.address}
//           onChange={handleChange}
//           placeholder="Address"
//           className="w-full mb-2 p-2 border rounded"
//         />

//         <div className="flex justify-end gap-2 mt-4">
//           <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
//             Cancel
//           </button>

//           {isCreator && (
//             <>
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded"
//                 onClick={handleSubmit}
//               >
//                 {event.title ? 'Update' : 'Add'}
//               </button>
//               <button
//                 className="bg-red-600 text-white px-4 py-2 rounded"
//                 onClick={handleDelete}
//               >
//                 Delete
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import { auth } from '@/lib/firebase';

// export default function CalendarModal({ event, onClose, isAdmin, onStarChange }) {
//   const modalRef = useRef();

//   const [form, setForm] = useState({
//     title: event.title || '',
//     description: event.description || '',
//     date: event.date || '',
//     start_time: event.start_time || '',
//     end_time: event.end_time || '',
//     address: event.address || '',
//   });

//   const [currentUserEmail, setCurrentUserEmail] = useState('');
//   const [isStarred, setIsStarred] = useState(false);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) setCurrentUserEmail(user.email);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchStarStatus = async () => {
//       if (currentUserEmail && event.id) {
//         const res = await fetch(`http://localhost:8080/api/getStarredEvents/${currentUserEmail}`);
//         const data = await res.json();
//         setIsStarred(data[event.id]?.starred || false);
//       }
//     };
//     fetchStarStatus();
//   }, [currentUserEmail, event.id]);

//   const handleClickOutside = (e) => {
//     if (modalRef.current && !modalRef.current.contains(e.target)) {
//       onClose();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     const method = event.id ? 'PUT' : 'POST';
//     const endpoint = event.id ? `/api/updateEvent/${event.id}` : '/api/addEvent';


//     await fetch(`http://localhost:8080${endpoint}`, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });

//     onClose();
//     window.location.reload();
//   };

//   const handleDelete = async () => {
//     if (!confirm('Are you sure you want to delete this event?')) return;
//     await fetch(`http://localhost:8080/api/deleteEvent/${event.id}`, { method: 'DELETE' });
//     onClose();
//     window.location.reload();
//   };

//   const handleStarToggle = async () => {
//     const newState = !isStarred;
//     setIsStarred(newState);
  
//     await fetch("http://localhost:8080/api/starEvent", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         user_email: currentUserEmail,
//         event_id: event.id,
//         starred: newState,
//       }),
//     });
  
//     // ✅ Notify parent
//     onStarChange?.(event.id, newState);
//   };
  

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     const [hour, minute] = timeString.split(':');
//     const date = new Date();
//     date.setHours(parseInt(hour), parseInt(minute));
//     return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
//   };

//   const isCreator = currentUserEmail === event.email;

//   return (
//     <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
//       <div ref={modalRef} className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg p-6 w-full max-w-md text-black relative">
//         <button onClick={handleStarToggle} className="absolute top-4 right-4 text-2xl">
//           <span className={isStarred ? 'text-yellow-400' : 'text-gray-400'}>★</span>
//         </button>

//         <h2 className="text-2xl font-semibold mb-4">
//           {event.title ? 'Event Details' : 'Add New Event'}
//         </h2>

//         <input
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//           placeholder="Title"
//           className="w-full mb-2 p-2 border rounded"
//         />
//         <input
//           name="date"
//           value={form.date}
//           onChange={handleChange}
//           placeholder="YYYY-MM-DD"
//           className="w-full mb-2 p-2 border rounded"
//         />
//         <input
//           name="time"
//           value={
//             form.start_time && form.end_time
//               ? `${formatTime(form.start_time)} - ${formatTime(form.end_time)}`
//               : ''
//           }
//           disabled
//           className="w-full mb-2 p-2 border rounded"
//         />
//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           placeholder="Description"
//           className="w-full mb-2 p-2 border rounded"
//         />
//         <textarea
//           name="address"
//           value={form.address}
//           onChange={handleChange}
//           placeholder="Address"
//           className="w-full mb-2 p-2 border rounded"
//         />

//         <div className="flex justify-end gap-2 mt-4">
//           <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
//           {isCreator && (
//             <>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
//                 {event.title ? 'Update' : 'Add'}
//               </button>
//               <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleDelete}>
//                 Delete
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

export default function CalendarModal({ event, onClose, isAdmin, onStarChange }) {
  const router = useRouter();
  const modalRef = useRef();

  const [form, setForm] = useState({
    title: event.title || '',
    description: event.description || '',
    date: event.date || '',
    start_time: event.start_time || '',
    end_time: event.end_time || '',
    address: event.address || '',
    fraternity: event.fraternity || 'N/A',
  });

  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setCurrentUserEmail(user.email);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchStarStatus = async () => {
      if (currentUserEmail && event.id) {
        const res = await fetch(`http://localhost:8080/api/getStarredEvents/${currentUserEmail}`);
        const data = await res.json();
        setIsStarred(data[event.id]?.starred || false);
      }
    };
    fetchStarStatus();
  }, [currentUserEmail, event.id]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const method = event.id ? 'PUT' : 'POST';
    const endpoint = event.id ? `/api/updateEvent/${event.id}` : '/api/addEvent';

    await fetch(`http://localhost:8080${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    onClose();
    window.location.reload();
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    await fetch(`http://localhost:8080/api/deleteEvent/${event.id}`, { method: 'DELETE' });
    onClose();
    window.location.reload();
  };

  const handleStarToggle = async () => {
    const newState = !isStarred;
    setIsStarred(newState);

    await fetch("http://localhost:8080/api/starEvent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_email: currentUserEmail,
        event_id: event.id,
        starred: newState,
      }),
    });

    onStarChange?.(event.id, newState);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hour, minute] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const isCreator = currentUserEmail === event.email;
  const hasFraternityPage = form.fraternity && form.fraternity.toLowerCase() !== 'n/a';

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
      <div ref={modalRef} className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg p-6 w-full max-w-md text-black relative">
        <button onClick={handleStarToggle} className="absolute top-4 right-4 text-2xl">
          <span className={isStarred ? 'text-yellow-400' : 'text-gray-400'}>★</span>
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          {event.title ? 'Event Details' : 'Add New Event'}
        </h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          placeholder="YYYY-MM-DD"
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          name="time"
          value={
            form.start_time && form.end_time
              ? `${formatTime(form.start_time)} - ${formatTime(form.end_time)}`
              : ''
          }
          disabled
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full mb-2 p-2 border rounded"
        />

        <div className="flex justify-between items-center gap-2 mt-4">
        {hasFraternityPage ? (
            <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={() =>
                router.push(`/chapters/${form.fraternity.toLowerCase().replace(/\s+/g, '-')}`)
            }
            >
            Chapter Profile
            </button>
        ) : (
            <div></div> // Keeps layout consistent even if button isn't shown
        )}

        {isCreator && (
            <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
                {event.title ? 'Update' : 'Add'}
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleDelete}>
                Delete
            </button>
            </div>
        )}
        </div>
      </div>
    </div>
  );
}









