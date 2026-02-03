import { Link, useLocation } from "react-router-dom";
import { BiHome } from "react-icons/bi";
import { FaCampground } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";

const Sidebar = () => {
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname === path || pathname.startsWith(path + "/");

  /**
   * IMPORTANT:
   * Hide mobile bottom nav on discussion/chat pages
   * so MessageInput can own the bottom.
   *
   * Adjust this condition ONLY if your route changes.
   */
  const isDiscussionPage =
    pathname.includes("/discussion") ||
    pathname.includes("/post/") ||
    pathname.includes("/camp/");

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-16 lg:w-48 xl:w-60 h-[calc(100vh-56px)] flex-col bg-bg border-r border-border">
        <nav className="flex flex-1 flex-col gap-1 px-2 py-4 text-text-muted">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition
              ${
                isActive("/")
                  ? "bg-surface text-text-primary"
                  : "hover:bg-surface"
              }
            `}
          >
            <BiHome className="size-5" />
            <span className="hidden lg:inline text-sm font-medium">Home</span>
          </Link>

          <Link
            to="/charts"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition
              ${
                isActive("/charts")
                  ? "bg-surface text-text-primary"
                  : "hover:bg-surface"
              }
            `}
          >
            <HiMiniArrowTrendingUp className="size-5" />
            <span className="hidden lg:inline text-sm font-medium">
              Top Charts
            </span>
          </Link>

          <Link
            to="/your-camps"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition
              ${
                isActive("/your-camps")
                  ? "bg-surface text-text-primary"
                  : "hover:bg-surface"
              }
            `}
          >
            <FaCampground className="size-5" />
            <span className="hidden lg:inline text-sm font-medium">
              Your Camps
            </span>
          </Link>
        </nav>

        <div className="px-2 py-4 border-t border-border flex flex-col gap-2">
          <Link
            to="/create"
            className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl
                       bg-accent hover:bg-accent-hover text-black font-semibold transition"
          >
            <GoPlus className="size-5" />
            <span className="hidden lg:inline text-sm">Create Camp</span>
          </Link>

          <Link
            to="/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition
              ${
                isActive("/settings")
                  ? "bg-surface text-text-primary"
                  : "hover:bg-surface text-text-muted"
              }
            `}
          >
            <IoSettingsOutline className="size-5" />
            <span className="hidden lg:inline text-sm font-medium">
              Settings
            </span>
          </Link>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV (HIDDEN ON CHAT) */}
      {!isDiscussionPage && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-bg border-t border-border">
          <div className="flex items-center justify-around py-2">
            <Link
              to="/"
              className={`flex flex-col items-center gap-1 text-xs
                ${isActive("/") ? "text-accent" : "text-text-muted"}
              `}
            >
              <BiHome className="size-6" />
              Home
            </Link>

            <Link
              to="/charts"
              className={`flex flex-col items-center gap-1 text-xs
                ${isActive("/charts") ? "text-accent" : "text-text-muted"}
              `}
            >
              <HiMiniArrowTrendingUp className="size-6" />
              Charts
            </Link>

            <Link
              to="/create"
              className="relative -mt-6 flex items-center justify-center
                         w-14 h-14 rounded-full bg-accent text-black shadow-xl"
            >
              <GoPlus className="size-7" />
            </Link>

            <Link
              to="/your-camps"
              className={`flex flex-col items-center gap-1 text-xs
                ${isActive("/your-camps") ? "text-accent" : "text-text-muted"}
              `}
            >
              <FaCampground className="size-6" />
              Camps
            </Link>

            <Link
              to="/settings"
              className={`flex flex-col items-center gap-1 text-xs
                ${isActive("/settings") ? "text-accent" : "text-text-muted"}
              `}
            >
              <IoSettingsOutline className="size-6" />
              Settings
            </Link>
          </div>
        </nav>
      )}
    </>
  );
};

export default Sidebar;
