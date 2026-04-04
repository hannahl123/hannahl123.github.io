import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import LeftPanel from "./components/LeftPanel";
import About from "./components/About";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import AllProjects from "./components/AllProjects";

function App() {
  const [activeSection, setActiveSection] = useState("about");
  const [view, setView] = useState("main"); // 'main' or 'allProjects'
  const rightPanelRef = useRef(null);

  useEffect(() => {
    if (view !== "main" || !rightPanelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        root: rightPanelRef.current,
        threshold: 0.15,
      },
    );

    const sections = rightPanelRef.current.querySelectorAll("section");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [view]);

  const navigateTo = (newView) => {
    setView(newView);
    if (newView === "main") {
      setTimeout(() => {
        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    } else {
      window.scrollTo(0, 0);
    }
  };

  if (view === "allProjects") {
    return <AllProjects onNavigate={navigateTo} />;
  }

  return (
    <div className="app-container bg-background">
      <div className="left-panel">
        <LeftPanel activeSection={activeSection} />
      </div>
      <div className="right-panel" ref={rightPanelRef}>
        <About />
        <Experience />
        <Projects onNavigate={navigateTo} />
        <Footer />
      </div>
    </div>
  );
}

export default App;
