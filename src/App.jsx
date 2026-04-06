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
  const sectionVisibility = useRef({});

useEffect(() => {
  if (view !== "main" || !rightPanelRef.current) return;

  const root = window.innerWidth <= 768 ? null : rightPanelRef.current;

  // Observer for fade-in animations
  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      root,
      threshold: 0.15,
    },
  );

  // Observer for active section tracking (scroll-spy)
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sectionVisibility.current[entry.target.id] = entry.isIntersecting;
      });

      // Get all sections that are currently intersecting the trigger zone
      const activeIds = Object.keys(sectionVisibility.current).filter(
        (id) => sectionVisibility.current[id],
      );

      if (activeIds.length > 0) {
        // Sort based on their order in the DOM to ensure consistent behavior
        // The "active" section is typically the one furthest down that is visible in the trigger zone
        const sectionOrder = ["about", "experience", "projects"];
        const currentActive = sectionOrder
          .filter((id) => activeIds.includes(id))
          .pop();

        if (currentActive) {
          setActiveSection(currentActive);
        }
      }
    },
    {
      root,
      rootMargin: "0px 0px -60% 0px", // Top 40% of the viewport is the trigger zone
    },
  );

  const sections = rightPanelRef.current.querySelectorAll("section");
  sections.forEach((section) => {
    animationObserver.observe(section);
    navObserver.observe(section);
  });

  return () => {
    sections.forEach((section) => {
      animationObserver.unobserve(section);
      navObserver.unobserve(section);
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
