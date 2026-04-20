import React, { useState } from "react";
import { projects } from "../data/projects";

const Projects = ({ onNavigate }) => {
  const visibleProjects = projects.slice(0, 5);

  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-primary">My Projects</h2>
          <p className="mt-2 text-secondary">A selection of my recent work.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
          {visibleProjects.map((project, index) => (
            <div
              key={project.title}
              className="flex flex-col justify-between p-8 transition duration-300 transform rounded-3xl shadow-lg hover:bg-card project-card-enter"
            >
              <div>
                <h3 className="text-xl font-bold text-center text-primary">
                  {project.title}
                </h3>
                <p className="mt-4 text-secondary">{project.description}</p>
              </div>
              <div className="mt-6">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-4 text-2xl text-primary hover:text-accent"
                  >
                    <i className="fab fa-github"></i>
                  </a>
                )}
                {project.youtube && (
                  <a
                    href={project.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-4 text-2xl text-primary hover:text-accent"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                )}
                {project.figma && (
                  <a
                    href={project.figma}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-4 text-2xl text-primary hover:text-accent"
                  >
                    <i className="fab fa-figma"></i>
                  </a>
                )}
                {project.devpost && (
                  <a
                    href={project.devpost}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl mr-4 text-primary hover:text-accent"
                  >
                    <i className="fas fa-film"></i>
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-primary hover:text-accent"
                  >
                    <i className="fa-solid fa-up-right-from-square"></i>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        {projects.length > 5 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate("allProjects")}
              className="px-6 py-3 font-semibold text-md text-primary bg-transparent border-2 border-accent-hover rounded-3xl transition-colors duration-300 hover:bg-accent-hover"
            >
              View all projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
