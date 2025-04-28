import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const UserProfile = () => {
  return (
    <div className="bg-primary-50 max-w mx-auto flex items-center rounded-lg  border-slate-100 p-6">
      <Image
        src="/assets/images/avt.webp"
        alt="Katen Doe"
        width={200}
        height={200}
        className="size-24 rounded-full border-2 border-white object-cover shadow-sm"
      />
      <div className="ml-6">
        <h2 className="text-2xl font-bold text-gray-800">Le Minh Quang</h2>
        <p className="mt-1 text-gray-600">
          I amafinal-year Software Engineering student aiming to become a Senior
          Software Engineer within the next 5 years. I ameager to enhance my
          technical skills, contribute to impactful projects, and grow through
          continuous learning and mentoring opportunities.
        </p>
        <div className="mt-3 flex justify-between space-x-4 text-gray-600">
          <div className="flex space-x-4">
            <div>Contact me:</div>
            {/* <a href="#" className=" hover:text-blue-500">
              <FaFacebook size={20} />
            </a>
            <a href="#" className=" hover:text-pink-500">
              <FaInstagram size={20} />
            </a> */}
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
          <div>
            <a
              href="/pdf/LeMinhQuang_FullStackDeveloper_CV.pdf"
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
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
