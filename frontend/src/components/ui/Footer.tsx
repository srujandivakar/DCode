import { Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div>
      <footer className="text-zinc-300 px-6 py-12 border-t border-neutral-800 w-full">
        <div className="max-w-6xl mx-auto w-full flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 ml-28">
            <div>
             <div className=" -mt-6">
               <div className="flex items-center space-x-2">
                 <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                   <span className="text-white font-bold text-sm">&lt;/&gt;</span>
                 </div>
                 <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                   DCode
                 </span>
               </div>
             </div>
              <p className="text-sm text-gray-400 mb-4">
                Empowering developers to become coding masters through practice,
                challenges, and community.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/srujandivakar"
                  target="_blank"
                  className="text-gray-400 hover:text-white"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  className="text-gray-400 hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/srujandivakar/"
                  target="_blank"
                  className="text-gray-400 hover:text-white"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/problemset"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Challenges
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contest"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Contest
                  </Link>
                </li>
                <li>
                  <Link
                    to="/discuss"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Discussion Forum
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sheets"
                    className="hover:text-blue-400 transition-colors"
                  >
                   Sheets
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/problemset"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/problemset"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/problemset"
                    className="hover:text-blue-400 transition-colors"
                  >
                    API
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Legal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
               {new Date().getFullYear()} Dcode - made by Srujan Divakar
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-blue-400"
              >
                Privacy Policy
              </Link>
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-blue-400"
              >
                Terms of Service
              </Link>
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-blue-400"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
