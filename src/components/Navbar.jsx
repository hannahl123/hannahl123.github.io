import React, { useState } from "react";
import "./flower.css";

const NavLink = ({ id, label, activeSection, onClick, showActive }) => (
  <a
    href={`#${id}`}
    onClick={(e) => onClick(e, id)}
    className={`group transition duration-300 hover:text-accent py-2 flex items-center ${
      showActive && activeSection === id ? "active text-accent" : ""
    }`}
  >
    <div className="flower-container w-8 mr-4 flex items-center justify-center">
      <div className="flower">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`petal petal${i + 1}`}></div>
        ))}
        <div className="center"></div>
      </div>
    </div>
    <span
      className="ml-4 font-bold"
      style={{ fontFamily: "'Delius Swash Caps', cursive" }}
    >
      {label}
    </span>
  </a>
);

const Navbar = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
  ];

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    setIsOpen(false);
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const desktopNavLinks = sections.map((section) => (
    <NavLink
      key={section.id}
      id={section.id}
      label={section.label}
      activeSection={activeSection}
      onClick={handleScroll}
      showActive={true}
    />
  ));

  const mobileNavLinks = sections.map((section) => (
    <NavLink
      key={section.id}
      id={section.id}
      label={section.label}
      activeSection={activeSection}
      onClick={handleScroll}
      showActive={false}
    />
  ));

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-6 right-6 z-50 text-primary p-2 focus:outline-none bg-background rounded-full shadow-md transition-transform duration-300 hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div className="relative w-8 h-8">
          <svg
            className={`absolute top-0 left-0 w-8 h-8 transition-all duration-300 ease-in-out transform ${
              isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <svg
            className={`absolute top-0 left-0 w-8 h-8 transition-all duration-300 ease-in-out transform ${
              !isOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
      </button>

      {/* Desktop Nav */}
      <nav className="hidden md:flex flex-col space-y-4 text-lg mb-20">
        {desktopNavLinks}
      </nav>

      {/* Mobile Nav */}
      <nav
        className={`md:hidden fixed inset-0 z-40 bg-background flex flex-col items-center justify-center space-y-8 text-2xl transition-opacity duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {mobileNavLinks}
      </nav>
    </>
  );
};

export default Navbar;
