import React from "react";
import UserProfile from "@/components/ui/UserProfile";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import SectionResume from "@/components/containers/resume/sectionLayout";
import { EDUCATION_ITEMS, EXPERIENCE_ITEMS, SKILLS } from "@/constants/project";

function ResumePage() {
  return (
    <div className="mx-auto w-full px-2 text-gray-800 lg:w-[1280px] lg:px-6">
      <UserProfile />
      <div className="space-y-8 lg:ml-32">
        <SectionResume icon={SparklesIcon} title="Skills">
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 md:grid-cols-3">
            {SKILLS.map(({ icon: SkillIcon, text }, idx) => (
              <div key={idx} className="flex items-center gap-2 lg:ml-5">
                <SkillIcon className="size-4 text-blue-500" />
                {text}
              </div>
            ))}
          </div>
        </SectionResume>
        <SectionResume icon={AcademicCapIcon} title="Education & Achievement">
          <ul className="list-inside list-disc space-y-1 text-sm">
            {EDUCATION_ITEMS.map((item, idx) => (
              <li className="lg:ml-6" key={idx}>
                {item}
              </li>
            ))}
          </ul>
        </SectionResume>

        <SectionResume icon={BriefcaseIcon} title="Experience">
          <ul className="list-inside list-disc space-y-2 text-sm">
            {EXPERIENCE_ITEMS.map((exp, idx) => (
              <li className="lg:ml-6" key={idx}>
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
        </SectionResume>
      </div>
    </div>
  );
}

export default ResumePage;
