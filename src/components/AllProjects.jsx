import React from "react";
import Footer from "./Footer";
import { projects } from "../data/projects";

const AllProjects = ({ onNavigate }) => {
  return (
    <div className="bg-background pb-12">
      <div className="w-full min-h-screen bg-background p-8 md:p-16 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative mb-8 flex flex-col md:flex-row items-center justify-center pt-16 md:pt-0">
            <button
              onClick={() => onNavigate("main")}
              className="absolute top-0 md:top-auto md:translate-y-0 left-0 px-6 py-2 font-semibold text-primary bg-transparent border-2 border-primary rounded-full transition-all duration-300 hover:bg-primary hover:text-background flex items-center gap-2"
            >
              <span>&larr;</span> Go Back
            </button>

            <div className="text-center">
              <h2 className="text-4xl font-bold text-primary">All Projects</h2>
              <p className="mt-2 text-secondary">
                Browse the full collection of my work!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.title}
                className="flex flex-col justify-between p-8 transition duration-300 transform rounded-3xl shadow-lg hover:bg-card project-card-enter"
              >
                <div>
                  <h3 className="text-xl font-bold text-primary">
                    {project.title}
                  </h3>
                  <p className="mt-4 text-secondary leading-relaxed">
                    {project.description}
                  </p>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllProjects;
