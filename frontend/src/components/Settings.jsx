import { Link, Outlet } from "react-router-dom";
import { MdAccountBox } from "react-icons/md";
import { MdSecurity } from "react-icons/md";
import { TiPointOfInterestOutline } from "react-icons/ti";
import { MdOutlineLogout } from "react-icons/md";
import { handleError, handleSuccess } from "../notify/Notification";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { BiCloudUpload } from "react-icons/bi";

const Settings = () => {
  const { loading, setLoading, setLoginUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setTimeout(() => {
          localStorage.removeItem("user");
          setLoginUser(null);
        }, 2000);
      } else {
        handleError(result.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

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

        <Link
          to="/settings/upload-avatar"
          className="flex items-center gap-2 px-2 py-2 hover:text-[#fafafa]"
        >
          <BiCloudUpload /> Upload Avatar
        </Link>

        <button
          onClick={handleLogout}
          disabled={loading}
          className={`w-28 flex gap-1 px-3 py-2 font-bold rounded-lg text-orange-400 text-sm sm:text-base hover:bg-orange-400 hover:text-black 
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <MdOutlineLogout size={18} className="mt-1" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Settings;
