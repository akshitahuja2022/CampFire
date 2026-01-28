import { Link, Outlet } from "react-router-dom";
import { MdAccountBox } from "react-icons/md";
import { MdSecurity } from "react-icons/md";
import { TiPointOfInterestOutline } from "react-icons/ti";

const Settings = () => {
  return (
    <div className="p-5 m-5 bg-[#111113] rounded-md">
      <h2 className="text-xl">Settings </h2>

      <nav className="flex flex-col gap-2 py-4 text-[#a3a3a3]">
        <Link
          to="/settings/account"
          className="flex items-center gap-2 px-2 py-2 hover:text-[#fafafa]"
        >
          <MdAccountBox /> Account & Profile
        </Link>

        <Link
          to="/settings/privacy"
          className="flex items-center gap-2 px-2 py-2 hover:text-[#fafafa]"
        >
          <MdSecurity /> Security & Privacy
        </Link>

        <Link
          to="/settings/add-interest"
          className="flex items-center gap-2 px-2 py-2 hover:text-[#fafafa]"
        >
          <TiPointOfInterestOutline /> Add Interests
        </Link>
      </nav>
    </div>
  );
};

export default Settings;
