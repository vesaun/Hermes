"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Nav"; // Adjust the path as needed
import Footer from "../components/footer"; // Adjust the path as needed
import Link from "next/link";

export default function UserHomepage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("events");

  // Update the activeTab based on the URL query (e.g., ?tab=explore)
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // If the user is not logged in, show a message or redirect
  if (!session && status !== "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B] flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl mb-4">You are not signed in.</h2>
          <Link
            href="/"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Render the content based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case "events":
        return <EventsTab />;
      case "explore":
        return <ExploreFraternitiesTab />;
      case "account":
        return <AccountInformationTab />;
      case "calendar":
        return <Calendar />;
      default:
        return <EventsTab />;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-blue-900 p-10">
          {renderTabContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function EventsTab() {
  const { data: session, status } = useSession();
  const [parsedEvents, setParsedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading" && session) {
      const accessToken = session.accessToken;
      const userEmail = session.user.email;
      const timeMin = new Date().toISOString();

      // Build the URL for fetching events from the primary calendar
      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&singleEvents=true&orderBy=startTime`;

      fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // Filter events to include those the user is attending or created
          const myEvents = (data.items || []).filter((event) => {
            const isAttendee =
              event.attendees &&
              event.attendees.some(
                (attendee) =>
                  attendee.email === userEmail &&
                  attendee.responseStatus === "accepted"
              );
            const isCreator =
              event.creator && event.creator.email === userEmail;
            return isAttendee || isCreator;
          });
          setParsedEvents(myEvents);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
          setLoading(false);
        });
    }
  }, [session, status]);

  if (status === "loading" || loading) return <p className="text-white">Loading events...</p>;
  if (!session) return <p className="text-white">You are not signed in.</p>;

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold text-blue-300 mb-6">My Registered Events</h2>
      {parsedEvents.length > 0 ? (
        <ul>
          {parsedEvents.map((event) => (
            <li key={event.id} className="mb-4">
              <h3 className="text-xl font-semibold text-blue-200">
                {event.summary || "No Title"}
              </h3>
              <p>
                <strong>Start:</strong>{" "}
                {new Date(event.start.dateTime || event.start.date).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {new Date(event.end.dateTime || event.end.date).toLocaleString()}
              </p>
              {event.location && (
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
              )}
              {event.description && (
                <p>
                  <strong>Description:</strong> {event.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No events found that you&apos;re registered for.</p>
      )}
    </div>
  );
}

function ExploreFraternitiesTab() {
  return (
    <div className="text-blue-200">
      <h2 className="text-4xl font-bold mb-6">Explore Fraternities</h2>
      <p>Discover and connect with various fraternities.</p>
    </div>
  );
}

function AccountInformationTab() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
  
    useEffect(() => {
      if (session && session.user && session.user.email) {
        async function fetchUserData() {
          try {
            const response = await fetch(
              `http://127.0.0.1:8080/api/findUserData/${session.user.email}`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" }
              }
            );
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setUserData(data);
          } catch (err) {
            console.error("Error fetching user data:", err);
            setError(err.message);
          } finally {
            setLoadingData(false);
          }
        }
        fetchUserData();
      }
    }, [session]);
  
    if (status === "loading") return <p>Loading session...</p>;
    if (!session) return <p>You are not signed in.</p>;
  
    return (
      <div className="text-blue-200">
        <h2 className="text-4xl font-bold mb-6">Account Settings</h2>
        <p>Welcome, {session.user.name}!</p>
        <p>Your email is: {session.user.email}</p>
        
        {loadingData ? (
          <p>Loading user data...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : userData ? (
          <div>
            <h3>User Data:</h3>
            <pre>{JSON.stringify(userData, null, 2)}</pre>
          </div>
        ) : (
          <p>No user data found.</p>
        )}
  
        {/* You can add more account-related info here */}
      </div>
    );
  }

function Calendar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-white">Loading session...</p>;
  }

  if (!session) {
    return <p className="text-white">You are not signed in.</p>;
  }

  // Retrieve the user's local timezone from the browser
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Build the embed URL using the user's email and timezone
  const calendarUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
    session.user.email
  )}&ctz=${encodeURIComponent(userTimeZone)}`;

  return (
    <iframe
      src={calendarUrl}
      style={{ border: 0, width: "100%", height: "600px" }}
      frameBorder="0"
      scrolling="no"
      title="Google Calendar"
    />
  );
}
