import React from "react";

const About = () => {
  return (
    <section id="about" className="py-20">
      <h2 className="text-3xl font-bold mb-12 text-center text-primary">
        About me
      </h2>
      <p className="text-lg text-secondary">
        Hello! I'm <span className="text-accent">Hannah Liu</span>, a
        second-year Software Engineering student at the University of Waterloo.
        I have a strong passion for technology, problem-solving, and project
        development. In my free time, I learn new melodies on the piano, go for
        walks, and chat with others who share my enthusiasm for programming and
        problem-solving.
      </p>
      <br></br>
      <p className="text-lg text-secondary">
        In the past, I have been constantly expanding my knowledge by designing
        and developing various applications using a broad range of technologies,
        such as React, Python, TypeScript, and Figma. My skills and dedication
        to innovating tech have been strengthened and shown through my
        experience in programming contests and hackathon projects, along with
        awards in STEM and various other projects.
      </p>
      <div className="mt-8 text-center">
        <a
          href="/Resume_Hannah_liu.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 text-md font-semibold text-primary bg-transparent border border-accent-hover rounded-xl transition-colors duration-300 hover:bg-accent-hover"
        >
          My Resume
        </a>
      </div>
    </section>
  );
};

export default About;
