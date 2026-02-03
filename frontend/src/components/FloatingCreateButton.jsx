import { useContext } from "react";
import { FiPlus } from "react-icons/fi";
import { CampContext } from "../context/authContext";

const FloatingCreateButton = () => {
  const { setOpen } = useContext(CampContext);

  return (
    <button
      onClick={() => setOpen(true)}
      aria-label="Create new post"
      className="
        fixed z-40
        right-4 bottom-20 sm:bottom-8
        w-14 h-14
        rounded-full
        bg-accent hover:bg-accent-hover
        text-black
        flex items-center justify-center
        shadow-xl
        transition-all
        hover:scale-105 active:scale-95
      "
    >
      <FiPlus className="w-6 h-6" />
    </button>
  );
};

export default FloatingCreateButton;
