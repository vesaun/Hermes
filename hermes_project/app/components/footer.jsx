"use client";
import { useState, useEffect } from "react";

export default function Footer() {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="footer" >
      <div className="container">
        &copy; {year ? year : "Loading..."} IFC Fraternity Network. All Rights Reserved.
        <div className="social-links">
          <a
            href="https://www.instagram.com/ifconthehill/?hl=en"
            target="_blank"
            // rel="noopener noreferrer"
          >
            <i className="bi bi-instagram" style={{ fontSize: "2rem", color: "#E1306C" }}></i>
          </a>
          <a href="https://www.facebook.com/BoulderIFC/"
            target="_blank"
            // rel="noopener noreferrer"
          >
            <i className="bi bi-facebook" style={{ fontSize: "2rem", color: "#1877F2" }}></i>
          </a>
          <a href="mailto:rush@coloradoifc.org"target="_blank"
          >
            <i className="bi bi-envelope-fill" style={{ fontSize: "2rem", color: "#0078D4" }}></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
