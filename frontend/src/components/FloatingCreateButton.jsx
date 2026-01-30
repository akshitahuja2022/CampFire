import React from "react";
import { FiPlus } from "react-icons/fi";

const FloatingCreateButton = () => {
  return (
    <button
      aria-label="Create new post"
      className="fixed right-4 bottom-6 md:right-10 md:bottom-8 z-30 w-14 h-14 rounded-full bg-orange-400 text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-orange-400"
    >
      <FiPlus className="w-6 h-6" />
    </button>
  );
};

export default FloatingCreateButton;
