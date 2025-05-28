'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import CalendarModal from '../components/CalendarModal';
import Navbar from "../components/Nav";
import AddEventsModal from '../components/AddEventsModal';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [starredMap, setStarredMap] = useState({});
  const [fraternityFilter, setFraternityFilter] = useState('All');
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userEmail = firebaseUser.email;

        const res = await fetch(`http://localhost:8080/api/findUserData/${userEmail}`);
        const data = await res.json();
        setIsAdmin(Array.isArray(data) ? data[0]?.admin === true : data?.admin === true);

        const starredRes = await fetch(`http://localhost:8080/api/getStarredEvents/${userEmail}`);
        const starredData = await starredRes.json();
        setStarredMap(starredData || {});
      } else {
        setUser(null);
      }
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/getCalendarEvents')
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []));
  }, []);

  if (loadingUser) return null;

  if (user === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B] flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl mb-4">You are not signed in.</h2>
          <a
            href="/"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const openModal = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleStarToggle = (eventId, starred) => {
    setStarredMap(prev => ({
      ...prev,
      [eventId]: { starred },
    }));
  };

  const handleEventCreated = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const fraternities = [
    'All',
    'Acacia',
    'Alpha Delta Phi',
    'Alpha Epsilon Pi',
    'Alpha Gamma Omega',
    'Alpha Phi Delta',
    'Alpha Kappa Lambda',
    'Alpha Sigma Phi',
    'Alpha Tau Omega',
    'Chi Psi',
    'Delta Kappa Epsilon',
    'Kappa Alpha Order',
    'Phi Kappa Psi',
    'Phi Gamma Delta',
    'Phi Kappa Alpha',
    'Pi Kappa Phi',
    'Sigma Alpha Epsilon',
    'Sigma Nu',
    'Tau Kappa Epsilon',
    'Theta Chi',
    'Theta Xi',
    'Zeta Beta Tau'
  ];

  const filteredEvents = events.filter(e => {
    const matchesFraternity = fraternityFilter === 'All' || e.fraternity?.toLowerCase() === fraternityFilter.toLowerCase();
    const matchesStarred = !showStarredOnly || starredMap[e.id]?.starred;
    return matchesFraternity && matchesStarred;
  });

  return (
    <>
      <Navbar />
      <div className="flex justify-center py-12 px-4 bg-white min-h-screen">
        <div className="w-full max-w-7xl bg-gray-700 rounded-3xl shadow-2xl p-10 border-4 border-gray-800">

          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
                <div className='bg-white'>
                    <select
                    value={fraternityFilter}
                    onChange={(e) => setFraternityFilter(e.target.value)}
                    className="px-2 py-1 rounded border text-black"
                >
                    {fraternities.map((name, i) => (
                    <option key={i} value={name}>{name}</option>
                    ))}
                </select>
                </div>
              <label className="flex items-center gap-1 text-white">
                <input
                  type="checkbox"
                  checked={showStarredOnly}
                  onChange={() => setShowStarredOnly(!showStarredOnly)}
                />
                Starred Only
              </label>
            </div>

            <h1 className="text-2xl font-bold text-white">
              {monthNames[month]} {year}
            </h1>

            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="text-lg font-bold px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
              >&lt;</button>
              <button
                onClick={handleNextMonth}
                className="text-lg font-bold px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
              >&gt;</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-300 text-center text-sm font-medium rounded-t-md overflow-hidden text-black">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-white py-3">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-300">
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`empty-${i}`} className="bg-white h-24" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = new Date(year, month, day).toISOString().split('T')[0];
              const dayEvents = filteredEvents.filter(e => e.date === dateStr);

              return (
                <div key={day} className="bg-white h-24 p-2 text-left relative">
                  <div className="font-semibold text-sm text-gray-800">{day}</div>
                  {dayEvents.map((event) => {
                    const isStarred = starredMap[event.id]?.starred;
                    const isIFC = event.created_by_ifc_admin;

                    return (
                        <div
                        key={event.id}
                        onClick={() => openModal(event)}
                        className={`mt-1 ${
                            isIFC
                            ? 'bg-purple-600' // ✅ different color for IFC events
                            : isStarred
                            ? 'bg-yellow-400'
                            : 'bg-blue-600'
                        } text-white text-xs rounded px-1 cursor-pointer`}
                        >
                        {event.title}
                        </div>
                    );
                    })}
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            {isAdmin && (
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded"
                onClick={() => setShowAddEventModal(true)}
              >
                Add Event
              </button>
            )}
          </div>

          {selectedEvent && (
            <CalendarModal
              event={selectedEvent}
              onClose={closeModal}
              isAdmin={isAdmin}
              onStarChange={handleStarToggle}
            />
          )}
          {showAddEventModal && (
            <AddEventsModal
              onClose={() => setShowAddEventModal(false)}
              onEventCreated={handleEventCreated}
            />
          )}
        </div>
      </div>
    </>
  );
}

