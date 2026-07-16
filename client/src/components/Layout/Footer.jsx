import React from "react";
import { Link } from "react-router-dom";
import { Brain, Github, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm mt-auto  text-white border-[#2A2A4A]">
      <div className="app-container py-6  text-white border-[#2A2A4A]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left  text-white border-[#2A2A4A]">
          <div className="flex items-center gap-2 text-gray-400 text-sm  text-white border-[#2A2A4A]">
            <Brain className="w-4 h-4 text-blue-400  text-white border-[#2A2A4A]" />
            <span className="font-medium text-white  text-white border-[#2A2A4A]">Cerebrum</span>
            <span className="hidden sm:inline text-gray-500  text-white border-[#2A2A4A]">|</span>
            <span className="text-gray-500 text-xs hidden sm:inline  text-white border-[#2A2A4A]">
              Empowering Minds Through Knowledge
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center md:justify-end  text-white border-[#2A2A4A]">
            <Link
              to="/about"
              className="text-gray-400  transition-colors text-sm hover:underline  text-white border-[#2A2A4A]"
            >
              About
            </Link>
            <Link
              to="/privacy"
              className="text-gray-400  transition-colors text-sm hover:underline  text-white border-[#2A2A4A]"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-gray-400  transition-colors text-sm hover:underline  text-white border-[#2A2A4A]"
            >
              Terms
            </Link>
            <a
              href="https://github.com/benjamindestiny/cerebrum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400  transition-colors flex items-center gap-1.5 text-sm hover:underline  text-white border-[#2A2A4A]"
            >
              <Github className="w-4 h-4  text-white border-[#2A2A4A]" />
              <span className="hidden sm:inline  text-white border-[#2A2A4A]">GitHub</span>
            </a>
            <a
              href="mailto:benjamindestiny449@gmail.com"
              className="text-gray-400  transition-colors flex items-center gap-1.5 text-sm hover:underline  text-white border-[#2A2A4A]"
            >
              <Mail className="w-4 h-4  text-white border-[#2A2A4A]" />
              <span className="hidden sm:inline  text-white border-[#2A2A4A]">Contact</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
