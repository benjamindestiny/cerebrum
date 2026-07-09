import React from "react";
import { Link } from "react-router-dom";
import { Brain, Github, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm mt-auto">
      <div className="app-container py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Brain className="w-4 h-4 text-[#6C2BD9]" />
            <span className="font-medium text-white">Cerebrum</span>
            <span className="hidden sm:inline text-gray-500">|</span>
            <span className="text-gray-500 text-xs hidden sm:inline">
              Empowering Minds Through Knowledge
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center md:justify-end">
            <Link
              to="/about"
              className="text-gray-400 hover:text-white transition-colors text-sm hover:underline"
            >
              About
            </Link>
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white transition-colors text-sm hover:underline"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white transition-colors text-sm hover:underline"
            >
              Terms
            </Link>
            <a
              href="https://github.com/benjamindestiny/cerebrum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm hover:underline"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="mailto:benjamindestiny449@gmail.com"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm hover:underline"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
