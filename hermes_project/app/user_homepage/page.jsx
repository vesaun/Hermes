'use client';
import Link from 'next/link';

export default function UserHomepage() {
    const [activeTab, setActiveTab] = useState('events');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'events':
                return <EventsTab />;
            case 'explore':
                return <ExploreFraternitiesTab />;
            case 'account':
                return <AccountInformationTab />;
            case 'calendar':
                return <Calendar />;
            default:
                return <EventsTab />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B]"> {/* Deep navy gradient */}
            <nav className="bg-[#1E40AF] shadow-2xl"> {/* Deep blue navbar */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h1 className="text-4xl font-extrabold text-white tracking-wider">HERMES</h1>
                        </div>
                        <div className="flex space-x-6">
                            {['events', 'explore', 'account', 'calendar'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                        activeTab === tab
                                            ? 'bg-red-600 text-white shadow-lg' 
                                            : 'text-white hover:bg-blue-800 hover:text-gray-200'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                            <Link href="/" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md"> 
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-blue-900 p-10"> 
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}

function EventsTab() {
    /*return (
        <div className="space-y-6">
            <h2 className="text-4xl font-bold text-blue-300 mb-6">Upcoming Events</h2>
            {[1, 2, 3].map((event) => (
                <div 
                    key={event} 
                    className="bg-[#0F172A] rounded-2xl shadow-xl p-6 flex items-center border border-blue-900 hover:border-blue-700 transition-all duration-300"
                > 
                    <div>
                        <h3 className="text-xl font-semibold text-blue-200">Event {event}</h3>
                        <p className="text-blue-400 mt-2">
                            A captivating event description filled with mystique and elegance.
                        </p>
                    </div>
                    <Link 
                        href={`/events/${event}`} 
                        className="ml-auto bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl"
                    >
                        View Details
                    </Link>
                </div>
            ))}
        </div>
    );*/
    const { data: session, status } = useSession();
  const [parsedEvents, setParsedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'loading' && session) {
      // Get the access token and the user's email from the session
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
          console.log('All fetched events:', data.items);

          // Parse events: filter to include events where the user is an attendee (accepted) or the creator
          const myEvents = (data.items || []).filter((event) => {
            const isAttendee =
              event.attendees &&
              event.attendees.some(
                (attendee) =>
                  attendee.email === userEmail &&
                  attendee.responseStatus === 'accepted'
              );
            const isCreator =
              event.creator && event.creator.email === userEmail;
            return isAttendee || isCreator;
          });

          console.log('Parsed events (signed up for):', myEvents);
          setParsedEvents(myEvents);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching events:', error);
          setLoading(false);
        });
    }
  }, [session, status]);

  if (status === 'loading' || loading) return <p>Loading events...</p>;
  if (!session) return <p>You are not signed in.</p>;

  return (
    <div>
      <h2>My Registered Events</h2>
      {parsedEvents.length > 0 ? (
        <ul>
          {parsedEvents.map((event) => (
            <li key={event.id} style={{ marginBottom: '1rem' }}>
              <h3>{event.summary || 'No Title'}</h3>
              <p>
                <strong>Start:</strong>{' '}
                {new Date(event.start.dateTime || event.start.date).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong>{' '}
                {new Date(event.end.dateTime || event.end.date).toLocaleString()}
              </p>
              {event.location && <p><strong>Location:</strong> {event.location}</p>}
              {event.description && <p><strong>Description:</strong> {event.description}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No events found that you're registered for.</p>
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

/*function AccountInformationTab() { 
    return (
        <div className="text-blue-200">
            <h2 className="text-4xl font-bold mb-6">Account Settings</h2>
            <p>Manage your profile and preferences.</p>
        </div>
    );
}*/
function AccountInformationTab() {
    const { data: session, status } = useSession();
  
    if (status === "loading") {
      return <p>Loading session...</p>;
    }
  
    if (!session) {
      return <p>You are not signed in.</p>;
    }
  
    return (
      <div className="text-blue-200">
        <h2 className="text-4xl font-bold mb-6">Account Settings</h2>
        <p>Welcome, {session.user.name}!</p>
        <p>Your email is: {session.user.email}</p>
        {/* You can add more account-related info here */}
      </div>
    );
  }

/*function Calendar() {
    const [events, setEvents] = useState([]);
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        function start() {
            gapi.client
                .init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    scope: SCOPES,
                    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
                })
                .then(() => {
                    const authInstance = gapi.auth2.getAuthInstance();
                    setIsSignedIn(authInstance.isSignedIn.get());

                    if (authInstance.isSignedIn.get()) {
                        console.log("User is signed in.");
                        fetchEvents();
                    } else {
                        console.log("User needs to sign in.");
                    }
                })
                .catch((error) => console.error("Error initializing Google API:", error));
        }

        gapi.load("client:auth2", start);
    }, []);

    function handleLogin() {
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.signIn().then(() => {
            console.log("User logged in.");
            fetchEvents();
        });
    }

    function handleLogout() {
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.signOut();
        setEvents([]);
        setIsSignedIn(false);
    }

    function fetchEvents() {
        if (!window.gapi || !window.gapi.client) {
            console.error("Google API client is not loaded yet.");
            return;
        }
    
        const authInstance = gapi.auth2.getAuthInstance();
        if (!authInstance.isSignedIn.get()) {
            console.error("User is not signed in.");
            return;
        }
    
        const user = authInstance.currentUser.get();
        const token = user.getAuthResponse().access_token;
        console.log("OAuth Token:", token);
    
        gapi.client.calendar.events
            .list({
                calendarId: "primary",
                timeMin: new Date().toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: 10,
                orderBy: "startTime",
            })
            .then((response) => {
                console.log("Events fetched:", response);
                setEvents(response.result.items || []);
            })
            .catch((error) => {
                console.error("Google API Error:", error);
            });
    }
    

    return (
        <div className="p-6 max-w-lg mx-auto bg-[#1E293B] shadow-md rounded-lg">
            <h2 className="text-4xl font-bold text-blue-300 mb-6">Google Calendar Events</h2>

            {!isSignedIn ? (
                <button
                    onClick={handleLogin}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition-all"
                >
                    Sign in with Google
                </button>
            ) : (
                <>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 transition-all"
                    >
                        Sign Out
                    </button>
                    <ul className="mt-6 space-y-4">
                        {events.length > 0 ? (
                            events.map((event) => (
                                <li key={event.id} className="p-4 bg-[#0F172A] rounded-lg border border-blue-900">
                                    <strong className="text-blue-200">{event.summary}</strong>
                                    <p className="text-blue-400 text-sm">
                                        {new Date(event.start.dateTime || event.start.date).toLocaleString()}
                                    </p>
                                </li>
                            ))
                        ) : (
                            <p className="text-blue-500">No upcoming events found.</p>
                        )}
                    </ul>
                </>
            )}
        </div>
    );
}*/
/*function Calendar() {
    
    return (
        <iframe
            src="https://calendar.google.com/calendar/embed"
            style={{ border: 0, width: "800px", height: "600px" }}
            frameBorder="0"
            scrolling="no"
        />
    );
}*/
/*function Calendar() {
    const [calendarUrl, setCalendarUrl] = useState("");
  
    useEffect(() => {
      function loadGapiAndInit() {
        if (!window.gapi) return;
        window.gapi.load("client:auth2", () => {
          window.gapi.client
            .init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              scope: SCOPES,
              discoveryDocs: [
                "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
              ],
            })
            .then(() => {
              const authInstance = window.gapi.auth2.getAuthInstance();
              if (authInstance.isSignedIn.get()) {
                const user = authInstance.currentUser.get();
                const email = user.getBasicProfile().getEmail();
                // Build the embed URL using the user's email as the calendar ID.
                setCalendarUrl(
                  `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
                    email
                  )}&ctz=America/New_York`
                );
              } else {
                // Optionally, you can force sign-in here.
                authInstance.signIn().then(() => {
                  const user = authInstance.currentUser.get();
                  const email = user.getBasicProfile().getEmail();
                  setCalendarUrl(
                    `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
                      email
                    )}&ctz=America/New_York`
                  );
                });
              }
            })
            .catch((error) => console.error("Error initializing GAPI:", error));
        });
      }
  
      // Load the gapi script if not already loaded.
      if (!window.gapi) {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.async = true;
        script.onload = loadGapiAndInit;
        document.body.appendChild(script);
      } else {
        loadGapiAndInit();
      }
    }, []);
  
    return (
      <div>
        {calendarUrl ? (
          <iframe
            src={calendarUrl}
            style={{ border: 0, width: "800px", height: "600px" }}
            frameBorder="0"
            scrolling="no"
          />
        ) : (
          <p>Loading calendar...</p>
        )}
      </div>
    );
  }*/
    /*function Calendar() {
        const [calendarUrl, setCalendarUrl] = useState('');
      
        useEffect(() => {
          function initializeGapi() {
            // Load the client:auth2 modules, then initialize with your credentials
            gapi.load('client:auth2', async () => {
              try {
                await gapi.client.init({
                  apiKey: API_KEY,
                  clientId: CLIENT_ID,
                  scope: SCOPES,
                  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                });
        
                const authInstance = gapi.auth2.getAuthInstance();
                // Check if user is already signed in
                if (authInstance.isSignedIn.get()) {
                  const user = authInstance.currentUser.get();
                  const email = user.getBasicProfile().getEmail();
                  // Build the embed URL with the user's email
                  setCalendarUrl(
                    `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(email)}&ctz=America/New_York`
                  );
                } else {
                  // Optionally, force sign-in if not already signed in
                  authInstance.signIn().then(() => {
                    const user = authInstance.currentUser.get();
                    const email = user.getBasicProfile().getEmail();
                    setCalendarUrl(
                      `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(email)}&ctz=America/New_York`
                    );
                  });
                }
              } catch (error) {
                console.error('Error initializing GAPI:', error);
              }
            });
          }
        
          // Dynamically load the gapi script if not already loaded
          if (!window.gapi) {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.async = true;
            script.onload = initializeGapi;
            document.body.appendChild(script);
          } else {
            initializeGapi();
          }
        }, []);
        
        return (
          <div>
            {calendarUrl ? (
              <iframe
                src={calendarUrl}
                style={{ border: 0, width: "100%", height: "600px" }}
                frameBorder="0"
                scrolling="no"
                title="Google Calendar"
              />
            ) : (
              <p>Loading calendar...</p>
            )}
          </div>
        );
      }*/
        function Calendar() {
            const { data: session, status } = useSession();
          
            if (status === "loading") {
              return <p>Loading session...</p>;
            }
          
            if (!session) {
              return <p>You are not signed in.</p>;
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


//export default Calendar;