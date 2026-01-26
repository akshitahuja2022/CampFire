import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="">
      <div className="px-4 sm:px-6 font-serif m-2">
        <div className="flex justify-between items-center">
          {/* Logo/Site Heading */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-black text-2xl font-bold"
              aria-label="CampFire Home"
            >
              Camp<span className="text-orange-400 font-bold">Fire</span>
            </Link>
          </div>

          {/* Desktop Menu - Buttons on the right */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="px-3 py-2 bg-orange-400 text-white font-bold rounded-lg hover:bg-orange-400 transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3 py-2 bg-orange-400 text-white font-bold rounded-lg hover:bg-orange-400 transition-all duration-200"
            >
              Signup
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 pl-14 rounded-md text-black"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? (
              <IoClose className="h-6 w-6" aria-hidden="true" />
            ) : (
              <IoMenu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Dropdown */}
      {isOpen && (
        <div className="absolute top-10 right-14 rounded-md md:hidden bg-orange-400 shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/login"
              className="text-white hover:bg-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-500"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-white hover:bg-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-500"
              onClick={() => setIsOpen(false)}
            >
              Signup
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
