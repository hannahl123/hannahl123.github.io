import React from "react";
import Navbar from "./Navbar";
import Contact from "./Contact";

const LeftPanel = ({ activeSection }) => {
  return (
    <div className="flex flex-col h-full justify-center text-primary items-start relative pb-16 md:pb-0">
      <div className="pt-32 mb-16">
        <h1
          className="text-5xl font-bold"
          style={{ fontFamily: "'Send Flowers', cursive" }}
        >
          Hannah Liu
        </h1>
        <p className="mt-2 text-lg pt-1">Software Engineering Student</p>
        <p className="mt-6 text-md">
          I am actively seeking <span className="font-bold">Fall 2026</span>{" "}
          internships where I can apply my skills and make meaningful
          contributions.{" "}
        </p>
        <p className="mt-6 text-md">Feel free to connect or reach out!</p>
      </div>
      <Navbar activeSection={activeSection} />
      <Contact />

      {/* Scroll Down Indicator for Mobile */}
      <button
        onClick={() => {
          const aboutSection = document.getElementById("about");
          if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
        className="md:hidden absolute bottom-4 left-0 w-full flex justify-center animate-bounce cursor-pointer focus:outline-none"
        aria-label="Scroll down to About section"
      >
        <svg
          className="w-8 h-8 text-primary opacity-70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  );
};

export default LeftPanel;
