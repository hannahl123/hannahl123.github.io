import React from "react";

const Contact = () => {
  return (
    <div
      id="contact"
      className="w-full flex items-center justify-center space-x-4"
    >
      <a
        href="https://www.instagram.com/hannahliu136/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl transition duration-300 text-primary hover:text-accent"
      >
        <i className="fab fa-instagram"></i>
      </a>
      <a
        href="https://github.com/hannahl123"
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl transition duration-300 text-primary hover:text-accent"
      >
        <i className="fab fa-github"></i>
      </a>
      <a
        href="https://www.linkedin.com/in/hannah-liu2006/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl transition duration-300 text-primary hover:text-accent"
      >
        <i className="fab fa-linkedin-in"></i>
      </a>
      <a
        href="mailto:liu.hannah136@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl transition duration-300 text-primary hover:text-accent"
      >
        <i className="far fa-envelope"></i>
      </a>
    </div>
  );
};

export default Contact;
