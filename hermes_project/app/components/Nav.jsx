"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (

    <nav className="nav">

      <div className="container">

        {/* Logo */}

        <Link href="/" className="logo">

        <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h1 className="text-4xl font-extrabold tracking-wider">HERMES</h1>
        </div>        
        </Link>

      {/* Desktop Menu */}
      <div className="nav-links hidden md:flex space-x-6">
        {/* Always-visible links */}
        <Link href="/" className="nav-link">
          <span className="icon">
            <i className="bi bi-house"></i>
          </span>
          <span className="link-text">Home</span>
        </Link>
        <Link href="/about" className="nav-link">
          <span className="icon">
            <i className="bi bi-info-circle"></i>
          </span>
          <span className="link-text">About</span>
        </Link>
        <Link href="/information" className="nav-link">
          <span className="icon">
            <i className="bi bi-card-text"></i>
          </span>
          <span className="link-text">Information</span>
        </Link>

        {/* If the user is logged in, show the “user” nav items */}
        {session && (
          <>
            <Link href="/user_homepage?tab=events" className="nav-link">
              <span className="icon">
                <i className="bi bi-geo-alt"></i>
              </span>
              <span className="link-text">Events</span>
            </Link>
            <Link href="/user_homepage?tab=explore" className="nav-link">
              <span className="icon">
                <i className="bi bi-compass"></i>
              </span>
              <span className="link-text">Explore</span>
            </Link>
            <Link href="/user_homepage?tab=account" className="nav-link">
              <span className="icon">
                <i className="bi bi-person"></i>
              </span>
              <span className="link-text">Account</span>
            </Link>
            <Link href="/user_homepage?tab=calendar" className="nav-link">
              <span className="icon">
                <i className="bi bi-calendar"></i>
              </span>
              <span className="link-text">Calendar</span>
            </Link>
            <Link
              href={session.active ? "/user_homepage?tab=fraternities" : "/users"}
              className="nav-link"
            >
              <span className="icon">
                <i className={session.active ? "bi bi-people" : "bi bi-building"}></i>
              </span>
              <span className="link-text">
                {session.active ? "PNMs" : "Fraternities"}
              </span>
            </Link>
          </>
        )}
          {/* Auth Buttons */}
          {session ? (
            <button onClick={() => signOut()} className="sign-out">
              Sign Out
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => signIn("google", { callbackUrl: "/signup" })}
                className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Register
              </button>
              <button
                onClick={() => signIn("google", { callbackUrl: "/user_homepage?tab=events" })}
                className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu (toggle with menuOpen) */}
      {menuOpen && (
        <div className="mobile-menu md:hidden">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/information" onClick={() => setMenuOpen(false)}>Information</Link>

          {session && (
            <>
              <Link href="/user_homepage?tab=events" onClick={() => setMenuOpen(false)}>
                Events
              </Link>
              <Link href="/user_homepage?tab=explore" onClick={() => setMenuOpen(false)}>
                Explore
              </Link>
              <Link href="/user_homepage?tab=account" onClick={() => setMenuOpen(false)}>
                Account
              </Link>
              <Link href="/user_homepage?tab=calendar" onClick={() => setMenuOpen(false)}>
                Calendar
              </Link>

            </>
          )}

          {session ? (
            <button onClick={() => signOut()}>Sign Out</button>
          ) : (
            <button
              onClick={() => signIn("google", { callbackUrl: "/user_homepage?tab=events" })}
            >
              Log In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
