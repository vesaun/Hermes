"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Firestore user data when user logs in
  useEffect(() => {
    if (user?.email) {
      fetch(`http://127.0.0.1:8080/api/findUserData/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setUserData(data[0]); // Expecting a list from backend
        })
        .catch((err) => console.error("Error fetching account data:", err));
    }
  }, [user]);

  const isAdmin = userData?.admin === true;
  const isIFCAdmin = userData?.ifc_admin === true;

  return (
    <nav className="nav">
      <div className="container">
        <Link href="/" className="logo">
          <div className="flex items-center">
            <img src="/hermes_wings.jpg" alt="Hermes Logo" className="h-10 w-10 mr-4" />
            <h1 className="text-4xl font-extrabold tracking-wider">HERMES</h1>
          </div>
        </Link>

        <div className="nav-links hidden md:flex space-x-6">
          <Link href="/" className="nav-link">
            <span className="icon"><i className="bi bi-house"></i></span>
            <span className="link-text">Home</span>
          </Link>

          {user && (
            <>
              <Link href="/calendar" className="nav-link">
                <span className="icon"><i className="bi bi-calendar"></i></span>
                <span className="link-text">Calendar</span>
              </Link>
              {isAdmin && (
                <Link href="/users" className="nav-link">
                  <span className="icon"><i className="bi bi-people"></i></span>
                  <span className="link-text">PNMs</span>
                </Link>
              )}
              <Link href="/fraternities" className="nav-link">
                <span className="icon"><i className="bi bi-building"></i></span>
                <span className="link-text">Fraternities</span>
              </Link>
              {isAdmin && userData?.fraternity ? (
              <Link
                href="/fraternity_profile"
                className="nav-link"
              >
                <span className="icon"><i className="bi bi-building-gear"></i></span>
                <span className="link-text">Profile</span>
              </Link>
            ) : (
              <Link href="/ProfilePage" className="nav-link">
                <span className="icon"><i className="bi bi-person"></i></span>
                <span className="link-text">Account</span>
              </Link>
            )}

              {isIFCAdmin && (
                <Link href="/admin_dashboard" className="nav-link">
                  <span className="icon"><i className="bi bi-shield-lock"></i></span>
                  <span className="link-text">Dashboard</span>
                </Link>
              )}
            </>
          )}

          {user ? (
            <button onClick={() => signOut(auth)} className="sign-out">
              Sign Out
            </button>
          ) : (
            <div className="flex gap-4">
              <Link href="/signup">
                <button className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200">
                  Register
                </button>
              </Link>
              <Link href="/login">
                <button className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200">
                  Log In
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu md:hidden">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/information" onClick={() => setMenuOpen(false)}>Information</Link>

          {user && (
            <>
              <Link href="/user_homepage?tab=events" onClick={() => setMenuOpen(false)}>Events</Link>
              <Link href="/user_homepage?tab=explore" onClick={() => setMenuOpen(false)}>Explore</Link>
              <Link href="/user_homepage?tab=account" onClick={() => setMenuOpen(false)}>Account</Link>
              <Link href="/user_homepage?tab=calendar" onClick={() => setMenuOpen(false)}>Calendar</Link>
            </>
          )}

          {user ? (
            <button onClick={() => signOut(auth)}>Sign Out</button>
          ) : (
            <Link href="/login">
              <button>Log In</button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}


