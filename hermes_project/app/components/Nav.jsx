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
          IFC Fraternity Network
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links hidden md:flex">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/information" className="nav-link">Information</Link>

          {session ? (
            <button onClick={() => signOut()} className="sign-out">
              Sign Out
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => signIn("google", { callbackUrl: "/signup" })}
                className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                Register
              </button>
              <button
                onClick={() => signIn("google", { callbackUrl: "/user_homepage" })}
                className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu md:hidden">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/information" onClick={() => setMenuOpen(false)}>Information</Link>
          {session ? (
            <button onClick={() => signOut()}>Sign Out</button>
          ) : (
            <button onClick={() => signIn("google", { callbackUrl: "/" })}>
              Log In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
