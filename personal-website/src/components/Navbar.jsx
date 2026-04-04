import React from "react";
import "./flower.css";

const Navbar = ({ activeSection }) => {
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    const rightPanel = document.querySelector(".right-panel");
    if (targetElement && rightPanel) {
      rightPanel.scrollTo({
        top: targetElement.offsetTop - rightPanel.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="flex flex-col space-y-4 text-lg mb-20">
      <a
        href="#about"
        onClick={(e) => handleScroll(e, "about")}
        className={`group transition duration-300 hover:text-accent py-2 flex items-center ${
          activeSection === "about" ? "active" : ""
        }`}
      >
        <div className="flower-container w-8 mr-4 flex items-center justify-center">
          <div className="flower">
            <div className="petal petal1"></div>
            <div className="petal petal2"></div>
            <div className="petal petal3"></div>
            <div className="petal petal4"></div>
            <div className="petal petal5"></div>
            <div className="petal petal6"></div>
            <div className="petal petal7"></div>
            <div className="petal petal8"></div>
            <div className="center"></div>
          </div>
        </div>
        <span className="ml-4">About</span>
      </a>
      <a
        href="#experience"
        onClick={(e) => handleScroll(e, "experience")}
        className={`group transition duration-300 hover:text-accent py-2 flex items-center ${
          activeSection === "experience" ? "active" : ""
        }`}
      >
        <div className="flower-container w-8 mr-4 flex items-center justify-center">
          <div className="flower">
            <div className="petal petal1"></div>
            <div className="petal petal2"></div>
            <div className="petal petal3"></div>
            <div className="petal petal4"></div>
            <div className="petal petal5"></div>
            <div className="petal petal6"></div>
            <div className="petal petal7"></div>
            <div className="petal petal8"></div>
            <div className="center"></div>
          </div>
        </div>
        <span className="ml-4">Experience</span>
      </a>
      <a
        href="#projects"
        onClick={(e) => handleScroll(e, "projects")}
        className={`group transition duration-300 hover:text-accent py-2 flex items-center ${
          activeSection === "projects" ? "active" : ""
        }`}
      >
        <div className="flower-container w-8 mr-4 flex items-center justify-center">
          <div className="flower">
            <div className="petal petal1"></div>
            <div className="petal petal2"></div>
            <div className="petal petal3"></div>
            <div className="petal petal4"></div>
            <div className="petal petal5"></div>
            <div className="petal petal6"></div>
            <div className="petal petal7"></div>
            <div className="petal petal8"></div>
            <div className="center"></div>
          </div>
        </div>
        <span className="ml-4">Projects</span>
      </a>
    </nav>
  );
};

export default Navbar;
