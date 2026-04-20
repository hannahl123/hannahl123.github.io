import React from "react";
import ReactGA from "react-ga4";

const About = () => {
  return (
    <section id="about" className="py-20">
      <h2 className="text-3xl font-bold mb-8 text-center text-primary">
        About me
      </h2>
      <p className="text-[17px] 2xl:text-xl text-secondary">
        Hello! I'm <span className="text-accent font-bold">Hannah Liu</span>, a
        Software Engineering student at the University of Waterloo. I have a
        strong passion for technology, problem-solving, and project development.
        In my free time, I learn new melodies on the piano, go for walks, and
        chat with others who share my enthusiasm for programming and
        problem-solving.
      </p>
      <br></br>
      <p className="text-[17px] 2xl:text-xl text-secondary">
        My technical journey is defined by a commitment to continuous learning
        and innovation. I have interned at{" "}
        <span className="font-bold">Shopify</span> twice, where I contributed to
        large-scale systems serving over 2 million merchants. My work there has
        ranged from architecting centralized entitlement systems and optimizing
        ETL data pipelines to developing high-performance web components and
        modernizing analytics interfaces using React and TypeScript.
      </p>
      <br></br>
      <p className="text-[17px] 2xl:text-xl text-secondary">
        Beyond my professional experience, I enjoy designing and developing
        diverse applications to explore a broad tech stack, including Python,
        Node.js, and GCP. Whether I am leading a team to build an embedded
        security system or optimizing grocery routes in a mobile app, I focus on
        creating accessible, user-centric solutions.
      </p>
      <div className="mt-8 text-center">
        <a
          href="/Resume_Hannah_Liu.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            ReactGA.event({ category: "Conversion", action: "Clicked Resume" })
          }
          className="inline-block px-6 py-3 text-md font-semibold text-primary bg-transparent border-2 border-accent-hover rounded-3xl transition-colors duration-300 hover:bg-accent-hover"
        >
          My Resume
        </a>
      </div>
    </section>
  );
};

export default About;
