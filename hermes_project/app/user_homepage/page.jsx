'use client';
import { SignUp } from '../signup/page';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserHomepage() {
    const [activeTab, setActiveTab] = useState('events');
    const pathname = usePathname();

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
        <div className="min-h-screen bg-gray-50">
            /* Navbar */
                        <nav className="bg-white shadow-sm">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-between h-16">
                                    <div className="flex">
                                        <div className="flex-shrink-0 flex items-center">
                                            <h1 className="text-xl font-bold">Hermes</h1>
                                        </div>
                                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                            <button
                                                onClick={() => setActiveTab('events')}
                                                className={`${
                                                    activeTab === 'events'
                                                        ? 'border-indigo-500 text-gray-900'
                                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                            >
                                                Events
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('explore')}
                                                className={`${
                                                    activeTab === 'explore'
                                                        ? 'border-indigo-500 text-gray-900'
                                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                            >
                                                Explore Fraternities
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('account')}
                                                className={`${
                                                    activeTab === 'account'
                                                        ? 'border-indigo-500 text-gray-900'
                                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                            >
                                                Account Information
                                            </button>
                                        </div>
                                    </div>
                                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                        <Link href="/" className="bg-indigo-600 p-1 rounded-full text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            <span className="px-4 py-1">Logout</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {renderTabContent()}
            </div>
        </div>
    );
}

// Tab Components
function EventsTab() {
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Events</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Stay updated with the latest fraternity events.
                </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Event 1</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            Description of Event 1 with date and location
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Event 2</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            Description of Event 2 with date and location
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Event 3</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            Description of Event 3 with date and location
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}

function ExploreFraternitiesTab() {
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Explore Fraternities</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Discover and learn more about fraternities on campus.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-lg font-medium text-gray-900">Fraternity {i}</h4>
                        <p className="text-sm text-gray-500 mt-2">
                            Brief description of the fraternity, its values, and its history.
                        </p>
                        <button className="mt-4 text-indigo-600 hover:text-indigo-900">
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AccountInformationTab() {
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Account Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Personal details and application.
                </p>
            </div>
            <div className="border-t border-gray-200">
                <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Full name</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">John Doe</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">john.doe@example.com</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">(123) 456-7890</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">University</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Example University</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Membership Status</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Active</dd>
                    </div>
                </dl>
            </div>
            <div className="px-4 py-5 sm:px-6 flex justify-end space-x-3">
                <button className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                    Edit Profile
                </button>
                <button className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none">
                    Save Changes
                </button>
            </div>
        </div>
    );
}