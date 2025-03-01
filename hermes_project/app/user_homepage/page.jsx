'use client';
import { useState } from 'react';
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
                            {['events', 'explore', 'account'].map((tab) => (
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
    return (
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
    return (
        <div className="text-blue-200">
            <h2 className="text-4xl font-bold mb-6">Account Settings</h2>
            <p>Manage your profile and preferences.</p>
        </div>
    );
}
