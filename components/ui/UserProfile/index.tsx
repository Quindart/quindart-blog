/* eslint-disable tailwindcss/no-custom-classname */
import Image from "next/image";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";

const UserProfile = () => {
  return (
    <div className="bg-primary-50 mx-auto mt-10 flex items-center rounded-lg border-slate-100  lg:mt-0 lg:p-6">
      <Image
        src="/assets/images/avt.webp"
        alt="le-minh-quang"
        width={200}
        height={200}
        priority
        className="hidden size-24 rounded-full border-2 border-white object-cover shadow-sm lg:block"
      />
      <div className="lg:ml-6">
        <h2 className="text-2xl font-bold text-gray-800">Le Minh Quang</h2>
        <p className="mt-1 text-gray-600">
          I am a Frontend Software Engineer with nearly 2 years of experience in
          building scalable and user-friendly web and mobile applications. I aim
          to become a Senior Software Engineer within the next 5 years. I am
          eager to enhance my technical expertise, contribute to impactful
          projects, and grow through continuous learning, collaboration, and
          mentoring opportunities.
        </p>
        <div className="mb-10 mt-3 flex flex-wrap-reverse justify-center text-gray-600 lg:mb-0 lg:justify-between lg:space-x-4">
          <div className="flex space-x-4">
            <div>Contact me: +84 364835692 </div>
            <a
              href="https://github.com/Quindart"
              className=" hover:text-gray-800"
            >
              <FaGithub size={20} />
            </a>

            <a
              target="blank"
              href="https://www.linkedin.com/in/minh-quang-le-76410730a/"
              className="hover:text-blue-700"
            >
              <FaLinkedin size={20} />
            </a>
            {/* <a href="#" className="hover:text-blue-400">
              <FaTwitter size={20} />
            </a> */}
            <a
              href="https://www.youtube.com/@MinhQuangLe1902"
              target="blank"
              className=" hover:text-red-500"
            >
              <FaYoutube size={20} />
            </a>
          </div>

          <div className=" mb-2 flex w-full lg:mt-0 lg:w-auto">
            <a
              href="/pdf/LeMinhQuang_FrontendEngineer_CV.pdf"
              className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              target="blank"
            >
              Download resume
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
