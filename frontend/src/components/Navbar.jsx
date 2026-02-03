import { useContext, useState } from "react";
import { IoMenu, IoClose, IoLogIn, IoPersonAdd } from "react-icons/io5";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLogin } = useContext(AuthContext);

  return (
    <>
      {/* TOP NAVBAR */}
      <nav
        className="
          sticky top-0 z-40
          bg-bg/80 backdrop-blur-md
          border-b border-border
        "
      >
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            <span className="text-text-primary">Camp</span>
            <span className="text-accent">Fire</span>
          </Link>

          {/* Desktop actions */}
          {!isLogin && (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="
                  px-4 py-2 rounded-xl
                  border border-border
                  text-text-primary
                  hover:bg-surface
                  transition-all
                "
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="
                  px-4 py-2 rounded-xl
                  bg-accent hover:bg-accent-hover
                  text-black font-semibold
                  transition-all
                "
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(true)}
            className="
              md:hidden
              p-2 rounded-xl
              border border-border
              text-text-primary
              hover:bg-surface
              transition
            "
            aria-label="Open menu"
          >
            <IoMenu size={22} />
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        className={`
          fixed inset-0 z-50 md:hidden
          transition-all duration-300
          ${isOpen ? "visible" : "invisible"}
        `}
      >
        {/* Backdrop */}
        <div
          className={`
            absolute inset-0 bg-black/50
            transition-opacity duration-300
            ${isOpen ? "opacity-100" : "opacity-0"}
          `}
          onClick={() => setIsOpen(false)}
        />

        {/* Bottom Sheet */}
        <div
          className={`
            absolute bottom-0 left-0 right-0
            bg-surface border-t border-border
            rounded-t-3xl
            p-6
            transition-transform duration-300
            ${isOpen ? "translate-y-0" : "translate-y-full"}
          `}
        >
          {/* Handle */}
          <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />

          {/* Close */}
          <button
            onClick={() => setIsOpen(false)}
            className="
              absolute top-4 right-4
              p-2 rounded-full
              hover:bg-bg
              transition
            "
          >
            <IoClose size={22} />
          </button>

          {!isLogin && (
            <div className="space-y-4">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="
                  flex items-center gap-3
                  w-full px-4 py-3 rounded-2xl
                  border border-border
                  text-text-primary
                  hover:bg-bg
                  transition
                "
              >
                <IoLogIn size={20} />
                <span className="font-semibold">Login</span>
              </Link>

              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="
                  flex items-center gap-3
                  w-full px-4 py-3 rounded-2xl
                  bg-accent hover:bg-accent-hover
                  text-black font-semibold
                  transition
                "
              >
                <IoPersonAdd size={20} />
                <span>Create account</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
