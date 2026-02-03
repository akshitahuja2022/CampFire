import { useContext } from "react";
import { AuthContext, CampContext } from "../context/authContext";
import { FaUserGroup } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { handleError, handleSuccess } from "../notify/Notification";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const YourCamp = () => {
  const navigate = useNavigate();
  const { loading, setLoading, loginUser } = useContext(AuthContext);
  const { yourCamps, setYourCamps, setJoinCamps } = useContext(CampContext);

  const handleLeaveCamp = async (id) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/camp/leave/${id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setYourCamps((prev) => prev.filter((camp) => camp._id !== id));
        setJoinCamps((prev) => prev.filter((camp) => camp._id !== id));
      } else {
        handleError(result.error);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const getRemainingTime = (burnAt) => {
    if (!burnAt) return null;

    const diff = new Date(burnAt) - Date.now();
    if (diff <= 0) return "Expired";

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  };

  if (loading) return <Loader />;

  if (!yourCamps || yourCamps.length === 0) {
    return (
      <div className="p-5 rounded-2xl bg-surface border border-border text-text-secondary">
        <h2 className="text-lg font-semibold text-text-primary">Your Camps</h2>
        <p className="mt-1 text-sm">Camps you’ve joined will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-1 sm:px-2">
      {yourCamps.map((camp, i) => {
        const remainingTime = getRemainingTime(camp.burnAt);

        return (
          <div
            key={camp._id}
            onClick={() => navigate(`/camp-feed/${camp._id}`)}
            className="
              cursor-pointer
              bg-surface border border-border
              rounded-2xl p-4
              transition
              hover:border-accent
            "
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {camp.category.map((cat, idx) => (
                <span
                  key={idx}
                  className={`
                    px-3 py-1.5 text-xs font-semibold rounded-full
                    ${
                      idx % 4 === 0
                        ? "bg-blue-500/15 text-blue-400"
                        : idx % 4 === 1
                          ? "bg-green-500/15 text-green-400"
                          : idx % 4 === 2
                            ? "bg-purple-500/15 text-purple-400"
                            : "bg-orange-500/15 text-orange-400"
                    }
                  `}
                >
                  {cat}
                </span>
              ))}

              {remainingTime && (
                <span
                  className={`
                    flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full
                    ${
                      remainingTime === "Expired"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-accent/15 text-accent"
                    }
                  `}
                >
                  <FaRegClock className="text-xs" />
                  {remainingTime === "Expired" ? "Expired" : remainingTime}
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-text-primary leading-snug">
              {camp.title}
            </h3>

            <p className="mt-1 text-sm text-text-secondary line-clamp-2">
              {camp.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <FaUserGroup />
                <span>{camp.totalUsers}</span>
              </div>

              {camp.createdBy !== loginUser._id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLeaveCamp(camp._id);
                  }}
                  disabled={loading}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-semibold
                    bg-accent hover:bg-accent-hover
                    text-black transition
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  Leave
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default YourCamp;
