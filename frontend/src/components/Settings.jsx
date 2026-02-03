import { Link } from "react-router-dom";
import { MdAccountBox, MdSecurity, MdOutlineLogout } from "react-icons/md";
import { TiPointOfInterestOutline } from "react-icons/ti";
import { handleError, handleSuccess } from "../notify/Notification";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";

const THEMES = [
  { id: "default", label: "Default" },
  { id: "catppuccin-dark", label: "Catppuccin Dark" },
  { id: "rosepine-light", label: "Rose Pine Light" },
  { id: "pine-smoke", label: "Pine Smoke" },
  { id: "midnight-ash", label: "Midnight Ash" },
  { id: "bonfire-glow", label: "Bonfire Glow" },
  { id: "dawn-camp", label: "Dawn Camp" },
  { id: "coal-black", label: "Coal Black" },
];

const Settings = () => {
  const { loading, setLoading, setLoginUser } = useContext(AuthContext);

  const [currentTheme, setCurrentTheme] = useState(
    () => localStorage.getItem("theme") || "default",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  const applyTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    handleSuccess(`Theme changed to ${theme}`);
  };

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
    <div className="max-w-xl mx-auto p-6 bg-surface border border-border rounded-2xl">
      <h2 className="text-xl font-bold text-text-primary mb-4">Settings</h2>

      <nav className="flex flex-col gap-2 text-text-secondary">
        <Link
          to="/settings/account"
          className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-bg hover:text-text-primary"
        >
          <MdAccountBox /> Account & Profile
        </Link>

        <Link
          to="/settings/privacy"
          className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-bg hover:text-text-primary"
        >
          <MdSecurity /> Security & Privacy
        </Link>

        <Link
          to="/settings/add-interest"
          className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-bg hover:text-text-primary"
        >
          <TiPointOfInterestOutline /> Add Interests
        </Link>
      </nav>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-text-primary mb-2">
          Appearance
        </h3>

        <div className="flex flex-wrap gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => applyTheme(theme.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-semibold transition
                ${
                  currentTheme === theme.id
                    ? "bg-accent text-black"
                    : "bg-bg border border-border text-text-muted hover:text-text-primary"
                }
              `}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
            text-accent hover:bg-accent hover:text-black transition
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <MdOutlineLogout size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
