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
}
