import { useContext, useEffect } from "react";
import { handleError, handleSuccess } from "../notify/Notification";
import { AuthContext, CampContext } from "../context/authContext";
import Loader from "./Loader";
import { FaUserGroup } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

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

const HomeCamp = () => {
  const navigate = useNavigate();
  const { loading, setLoading } = useContext(AuthContext);
  const {
    personalisedCamps,
    setPpersonalisedCamps,
    joinCamps,
    setJoinCamps,
    setYourCamps,
  } = useContext(CampContext);

  useEffect(() => {
    const fetchPersonalisedCamps = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKNED_URL}/api/v1/camp/get`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const result = await response.json();
        setPpersonalisedCamps(result.data.camps);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalisedCamps();
  }, [setLoading, setPpersonalisedCamps]);

  const handleJoinCamp = async (id, e) => {
    e.stopPropagation();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/camp/join/${id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);

        const joinedCamp = personalisedCamps.find((c) => c._id === id);
        if (joinedCamp) {
          setJoinCamps((prev) => [...prev, joinedCamp]);
          setYourCamps((prev) => [...prev, joinedCamp]);
        }

        navigate("/your-camps");
      } else {
        handleError(result.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const isJoined = (campId) => joinCamps?.some((c) => c._id === campId);

  if (loading) return <Loader />;

  if (!personalisedCamps || personalisedCamps.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-6 rounded-2xl bg-surface border border-border text-text-secondary">
        <h2 className="text-lg font-semibold text-text-primary">
          No activity yet
        </h2>
        <p className="mt-1 text-sm mb-5">
          We couldn’t find camps matching your interests. Update your interests
          to personalize your feed.
        </p>
        <Link
          to="/settings/add-interest"
          className="inline-flex px-5 py-2.5 rounded-xl font-semibold bg-accent hover:bg-accent-hover text-black transition"
        >
          Add interests
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-1 sm:px-2">
      {personalisedCamps.map((camp) => {
        const remainingTime = getRemainingTime(camp.burnAt);

        return (
          <div
            key={camp._id}
            onClick={() => navigate(`/camp-feed/${camp._id}`)}
            className="
              cursor-pointer
              bg-surface border border-border
              rounded-2xl p-5
              transition
              hover:border-accent
              max-w-3xl mx-auto w-full
            "
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {camp.category.map((cat, i) => (
                <span
                  key={i}
                  className={`
                    px-3 py-1.5 text-xs font-semibold rounded-full
                    ${
                      i % 4 === 0
                        ? "bg-blue-500/15 text-blue-400"
                        : i % 4 === 1
                          ? "bg-green-500/15 text-green-400"
                          : i % 4 === 2
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

            <h3 className="text-lg sm:text-xl font-semibold text-text-primary truncate">
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

              <button
                onClick={(e) => {
                  if (!isJoined(camp._id)) {
                    handleJoinCamp(camp._id, e);
                  } else {
                    e.stopPropagation();
                  }
                }}
                className={`
                  px-4 py-1.5 rounded-full text-sm font-semibold transition
                  ${
                    isJoined(camp._id)
                      ? "bg-surface text-text-muted border border-border cursor-not-allowed"
                      : remainingTime === "Expired"
                        ? "bg-surface text-text-muted border border-border cursor-not-allowed"
                        : "bg-accent hover:bg-accent-hover text-black"
                  }
                `}
              >
                {remainingTime === "Expired"
                  ? "Expired"
                  : isJoined(camp._id)
                    ? "Joined"
                    : "Join"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HomeCamp;
