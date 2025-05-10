import React from "react";
import UserProfile from "@/components/ui/UserProfile";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
  GlobeAltIcon,
  ServerStackIcon,
  CpuChipIcon,
  CommandLineIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";

const educationItems = [
  "Software Engineering Student – Ho Chi Minh City University of Industry",
  "GPA: 8.1/10 – Scholarship in the Software Engineering major ",
  "Rank 1st Hackathon Webdev Adventure 2023 (VNUHCM-UIT)",
  "Japanese Language Scholarship at Dong Du University- FPT Software",
  "Scientific Report: 'Graduation Thesis Management System' - Score: 10/10",
];

const experienceItems = [
  {
    title:
      "Software Internship NodeJS & AngularJs @ AEGONA Company (Jan 2025 – April 2025)",
    details: [
      "Build API for e-commerce & booking system using NestJS and AngularJS.",
      "Design POS Website on Angular + RxJs.",
      "Actively participate in project management using Agile/Scrum",
      "Write GraphQL APIs to handle orders and manage draft orders.",
    ],
  },
  {
    title: "Admin & Developer IUH School Graduation Website (Aug 2024 - Now)",
    details: [
      "Developed a thesis management system for the Software Engineering major.",
      "Managed theses, dissertations, and scientific research for over 300 Software Engineering students.",
      "Supported more than 20 lecturers in supervising thesis groups.",
      "Built the application using React Query and Node.js (Express).",
      "Implemented modules for group management, document management, student tracking, task/timeline management, and role-based access control.",
    ],
  },
  {
    title:
      "Technical Web Callborator GEN 0.5 @ CodeMely Community (Oct 2023 - Nov 2023)",
    details: [
      "Developed a thesis management system for the Software Engineering major.",
      "Managed theses, dissertations, and scientific research for over 300 Software Engineering students.",
      "Supported more than 20 lecturers in supervising thesis groups.",
      "Built the application using React Query and Node.js (Express).",
      "Implemented modules for group management, document management, student tracking, task/timeline management, and role-based access control.",
    ],
  },
  {
    title: "Frontend Freelance @ Vinaole Company (May 2022 - July 2022)",
    details: [
      "Design an admin dashboard using Bootstrap5 andJavaScript,HTML iframes",
    ],
  },
];

const skills = [
  {
    icon: WrenchScrewdriverIcon,
    text: "ExpressJS, NestJS, Spring Boot, Socket.IO",
  },
  {
    icon: GlobeAltIcon,
    text: "React/Redux, AngularJs, React Query, Zustand",
  },
  {
    icon: ServerStackIcon,
    text: "MongoDB, MySQL, Redis",
  },
  {
    icon: CpuChipIcon,
    text: "GraphQL, RESTful API",
  },
  {
    icon: CommandLineIcon,
    text: "Base Linux, Jenkins CI/CD, Docker, NGINX",
  },
  {
    icon: CheckBadgeIcon,
    text: "SCSS/SASS, TailwindCSS, MUI, Flowbit ",
  },
];

const Section = ({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) => (
  <section>
    <div className="mb-2 flex items-center gap-2">
      <Icon className="size-5 text-slate-600" />
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    {children}
  </section>
);

function ResumePage() {
  return (
    <div className="mx-auto w-[1280px] px-6 text-gray-800">
      <UserProfile />
      <div className="ml-32 space-y-8">
        <Section icon={SparklesIcon} title="Skills">
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 md:grid-cols-3">
            {skills.map(({ icon: SkillIcon, text }, idx) => (
              <div key={idx} className="ml-5 flex items-center gap-2">
                <SkillIcon className="size-4 text-blue-500" />
                {text}
              </div>
            ))}
          </div>
        </Section>
        <Section icon={AcademicCapIcon} title="Education & Achievement">
          <ul className="list-inside list-disc space-y-1 text-sm">
            {educationItems.map((item, idx) => (
              <li className="ml-6" key={idx}>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={BriefcaseIcon} title="Experience">
          <ul className="list-inside list-disc space-y-2 text-sm">
            {experienceItems.map((exp, idx) => (
              <li className="ml-6" key={idx}>
                <span className="mb-2 font-semibold text-blue-500">
                  {exp.title}
                </span>
                <ul className="ml-5 list-disc space-y-1 text-gray-700">
                  {exp.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

export default ResumePage;
