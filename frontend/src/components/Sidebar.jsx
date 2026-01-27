import { Link } from "react-router-dom";
import { BiHome } from "react-icons/bi";
import { FaCampground } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";

const Sidebar = () => {
  return (
    <aside
      className="hidden md:flex md:w-16 lg:w-2/5 xl:max-w-60 h-[calc(100vh-49px)]
 flex-col p-2 lg:p-4 border-r border-[#1f1f23] text-white bg-[#111113]"
    >
      {/* Navigation Links */}
      <nav className="flex flex-1 flex-col gap-2 py-4 text-[#a3a3a3]">
        <Link
          to="/"
          className="flex items-center gap-3 px-2 py-2 md:justify-center lg:justify-start rounded-lg hover:bg-[#18181b] hover:text-[#fafafa] transition-colors"
        >
          <BiHome className="size-5 flex-shrink-0" />
          <span className="hidden lg:inline text-sm font-medium">Home</span>
        </Link>

        <Link
          to="/charts"
          className="flex items-center gap-3 px-2 py-2 md:justify-center lg:justify-start rounded-lg hover:bg-[#18181b] hover:text-[#fafafa] transition-colors"
        >
          <HiMiniArrowTrendingUp className="size-5 flex-shrink-0" />
          <span className="hidden lg:inline text-sm font-medium">
            Top Charts
          </span>
        </Link>

        <Link
          to="/your-camps"
          className="flex items-center gap-3 px-2 py-2 md:justify-center lg:justify-start rounded-lg hover:bg-[#18181b] hover:text-[#fafafa] transition-colors"
        >
          <FaCampground className="size-5 flex-shrink-0" />
          <span className="hidden lg:inline text-sm font-medium">
            Your Camps
          </span>
        </Link>
      </nav>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-[#1f1f23]">
        <Link
          to="/create"
          className="w-full flex items-center justify-center md:justify-center lg:justify-center gap-2 px-2 py-3 bg-orange-400 text-black font-bold rounded-lg hover:bg-orange-500 transition-colors"
        >
          <GoPlus className="size-5 flex-shrink-0" />
          <span className="hidden lg:inline text-sm">Create Camp</span>
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 px-2 py-2 md:justify-center lg:justify-start rounded-lg hover:bg-[#18181b] text-[#a3a3a3] hover:text-[#fafafa] transition-colors"
        >
          <IoSettingsOutline className="size-5 flex-shrink-0" />
          <span className="hidden lg:inline text-sm font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
