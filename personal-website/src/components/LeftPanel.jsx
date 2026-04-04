import React from "react";
import Navbar from "./Navbar";
import Contact from "./Contact";

const LeftPanel = ({ activeSection }) => {
  return (
    <div className="flex flex-col h-full justify-center text-primary items-start">
      <div className="pt-32 mb-16">
        <h1 className="text-5xl font-bold">Hannah Liu</h1>
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
    </div>
  );
};

export default LeftPanel;
