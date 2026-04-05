import React from "react";

const experiences = [
  {
    date: "Jan 2026 – Present",
    role: "Returning Software Engineering Intern",
    company: "Shopify",
    location: "Toronto, ON",
    points: [
      "Architected a centralized entitlement-based system to replace legacy plan-based access control, enabling scalable feature-gating and improving system auditability for millions of shops",
      "Engineered a product status filter for Shopify Analytics reports to enhance reporting accuracy and data granularity for 2+ million merchants by modifying ETL data pipelines and executing table migrations",
      "Developed 10+ high-performance web components to replace legacy React implementations and migrated 6 component usages, reducing main chunk size by 90% and initial download size by 82% via lazy-loading",
      "Built and released the new Analytics date controls using React and Preact, delivering a modernized UI and improved interaction performance for all merchants",
    ],
  },
  {
    date: "May – Aug 2025",
    role: "Software Engineering Intern",
    company: "Shopify",
    location: "Toronto, ON",
    points: [
      "Delivered interactive UI for the Shopify Analytics Dashboard used by 2+ million Shopify merchants to unlock valuable consumer insights, including features like draggable metrics in collapsed sections and animated transitions",
      "Integrated a widely used table component using TypeScript, Polaris, and CSS in order to generate the Customer Cohort Analysis report used by 2+ million Shopify merchants while aligning with modern architectural best practices",
      "Enhanced accessibility of the Shopify Admin Dashboard by adding ARIA labels and testing with VoiceOver, aligning with WCAG 2.1 standards to support screen reader users",
      "Increased test reliability from 30% to 99% by writing and maintaining end-to-end, unit and integration tests using Jest and Playwright, monitored with Prometheus and Grafana",
    ],
  },
  {
    date: "Aug – Dec 2021",
    role: "Web Developer",
    company: "Biomics Inc.",
    location: "Remote",
    points: [
      "Independently designed and developed a e-commerce website using WordPress for a biotechnology company to showcase its products and services, including chromatography and nucleic acid extraction",
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-primary text-center">
          Work Experience
        </h2>
        <div className="flex flex-col gap-12">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group flex p-8 transition duration-300 transform rounded-3xl shadow-lg border-transparent border-accent hover:bg-card"
            >
              <div className="text-sm font-semibold text-primary pt-1 w-1/4">
                <p>{exp.date}</p>
                <p className="text-sm text-secondary mt-1">{exp.location}</p>
              </div>
              <div className="w-3/4">
                <h3 className="text-primary group-hover:text-accent transition-colors duration-300 mb-2">
                  <span className="text-xl font-bold text-primary">
                    {exp.company} ·
                  </span>
                  <span className="text-lg font-semibold ml-2">{exp.role}</span>
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-primary">
                  {exp.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
