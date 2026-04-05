import React, { useState } from "react";

const projects = [
  {
    title: "Reflect.",
    description:
      "A React Native social media platform for users to find others who share similar goals and accomplishments and spread their own motivation.",
    github: "https://github.com/hannahl123/Reflect",
  },
  {
    title: "DoorSense",
    description:
      "An embedded smart door home security system built using a Raspberry Pi and a mobile iOS application created with React Native.",
    github: "https://github.com/hannahl123/DoorSense",
    youtube: "https://youtu.be/aOHLPfLZuMQ",
  },
  {
    title: "ShopSmart",
    description:
      "A mobile app to generate an optimized shopping trip to save users money and time, built with React Native, TypeScript, and MariaDB.",
    github: "https://github.com/hannahl123/shopsmart",
    figma:
      "https://www.figma.com/design/x6SbpCf6Gtpr1APJnDKFtF/CSC-Shopsmart-Mobile-Application?node-id=0-1&t=UjW9yQNoqp32LLl4-1",
  },
  {
    title: "Pocket Pantry",
    description:
      "An application that allows users to input their ingredients and receive auto-generated recipes based on what they have available.",
    github: "https://github.com/aaronpo97/PocketPantry-TOHacks2022",
    devpost: "https://devpost.com/software/food-recipes-app",
  },
  {
    title: "Undead Uprising",
    description:
      "An amazing zombie apocalyse game built using Pygame, Figma, and Pixilart, along with 5 teammates in ICS4U.",
    github: "https.github.com/hannahl123/Undead-Uprising",
    link: "https://docs.google.com/presentation/d/1F_sJXmkYe-hZkxfS5Jay8Xj4BIzXAWepC3uQKdALt6Y/edit#slide=id.g2b3aa5de134_0_766",
  },
  {
    title: "HaRP Hub",
    description:
      "A hackathon project created at RBC NGI Hackathon 2022, designed with Figma. Learned a lot more about how to use Figma and planning out ideas.",
    figma:
      "https://www.figma.com/file/3rLKPYUxDtNXEi2B9IdhKy/RBC-NGI-Hackathon?type=design&node-id=0-1",
    link: "https://www.canva.com/design/DAE4JiZx9cI/s0vIkiXrjBWhHzoJAg-7aA/edit?utm_content=DAE4JiZx9cI&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    title: "Personal Website",
    description:
      "The current website you are looking at, built with HTML, CSS, and JavaScript. This project has gone through countless updates and upgrades!",
    github: "https://github.com/hannahl123/hannahl123.github.io",
    link: "https://hannahl123.github.io/",
  },
  {
    title: "Generative Art",
    description:
      "A website made using JavaScript. Using your mouse, you can create different-shaped eclipses in different shades of green and blue.",
    github: "https://github.com/hannahl123/Glide-IT",
    link: "https://editor.p5js.org/readlife2000/full/eFrD0uXtq",
  },
  {
    title: "Glide IT",
    description:
      "An online game similar to Flappy Bird. You can control the square using arrow keys to avoid obstacles. My personal highscore is 25921.",
    github: "https://github.com/hannahl123/Glide-IT",
    link: "https://replit.com/@hannahliu123/Glide-IT",
  },
  {
    title: "Life Simulator",
    description:
      "A text-based game built with Python, where you can choose from various options what to do at each stage of your life.",
    github: "https.github.com/hannahl123/Life-Simulator",
  },
  {
    title: "Expiry Date App Tracker",
    description:
      "A simple prototype using POP Marvel with some basic features, such as adding an item, searching, and calendar views.",
    link: "https://marvelapp.com/prototype/a2bhc05/screen/80831514",
  },
  {
    title: "Black Fire Ring",
    description:
      "My first project related to VR! Built using HTML and A-frame, a WebVR framework, I created a simple VR environment.",
    github: "https://github.com/hannahl123/Black-Fire-Ring",
    link: "https://black-fire-ring.glitch.me/",
  },
  {
    title: "Time For Motivation",
    description:
      "A Discord bot made using Python. You can generate inspirational quotes by using the '?inspire' and/or '?daily' command.",
    github: "https://github.com/hannahl123/Time-For-Motivation",
  },
  {
    title: "Lego That Screams When You Step On It",
    description:
      "Made at my very first hackathon using a variety of technologies, such as React Native, Expo, and Python. I was exposed to the magic of coding!",
    link: "https://devpost.com/software/lego-that-screams-when-you-step-on-it-brightness-analyzer",
  },
];

const Projects = ({ onNavigate }) => {
  const visibleProjects = projects.slice(0, 5);

  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
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
                <h3 className="text-2xl font-bold text-center text-primary">
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
              className="px-6 py-3 font-semibold text-md text-primary bg-transparent border border-accent-hover rounded-xl transition-colors duration-300 hover:bg-accent-hover"
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
