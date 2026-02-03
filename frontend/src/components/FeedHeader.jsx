import { useContext, useEffect } from "react";
import { AuthContext, CampContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";
import { FaUserGroup } from "react-icons/fa6";
import { useParams } from "react-router-dom";

const formatRemainingTime = (burnIn) => {
  if (!burnIn) return null;

  const diff = burnIn - Date.now();
  if (diff <= 0) return "Expired";

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

const FeedHeader = () => {
  const { id } = useParams();
  const { setLoading } = useContext(AuthContext);
  const { camp, setCamp, setPosts, joinCamps, setJoinCamps, setYourCamps } =
    useContext(CampContext);

  useEffect(() => {
    setCamp(null);
    setPosts([]);

    const fetchGetCamps = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKNED_URL}/api/v1/post/get/${id}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const result = await response.json();
        setCamp(result.data.camp);
        setPosts(result.data.posts);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGetCamps();
  }, [id, setLoading, setCamp, setPosts]);

  const handleJoinCamp = async (campId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/camp/join/${campId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      const result = await response.json();

      if (result.success) {
        handleSuccess(result.message);
        setJoinCamps((prev) => [...prev, camp]);
        setYourCamps((prev) => [...prev, camp]);
      } else {
        handleError(result.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const isJoined =
    Array.isArray(joinCamps) && joinCamps.some((c) => c._id === camp?._id);

  const remainingTime = formatRemainingTime(camp?.burnAt);

  return (
    <section className="bg-bg">
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
                {camp?.title}
              </h1>

              {camp?.description && (
                <p className="mt-2 text-sm sm:text-base text-text-secondary line-clamp-2">
                  {camp.description}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                if (!isJoined && camp?._id) handleJoinCamp(camp._id);
              }}
              disabled={isJoined || remainingTime === "Expired"}
              className={`
                shrink-0 h-10 px-5 rounded-full text-sm font-semibold
                transition
                ${
                  isJoined
                    ? "bg-surface text-text-muted border border-border cursor-not-allowed"
                    : remainingTime === "Expired"
                      ? "bg-surface text-text-muted border border-border cursor-not-allowed"
                      : "bg-accent hover:bg-accent-hover text-black"
                }
              `}
            >
              {remainingTime === "Expired"
                ? "Expired"
                : isJoined
                  ? "Joined"
                  : "Join"}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-text-muted">
              <FaUserGroup size={14} />
              {camp?.totalUsers} member{camp?.totalUsers > 1 ? "s" : ""}
            </span>

            {remainingTime && (
              <span
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    remainingTime === "Expired"
                      ? "bg-red-500/15 text-red-400"
                      : "bg-accent/15 text-accent"
                  }
                `}
              >
                {remainingTime === "Expired"
                  ? "Camp expired"
                  : `Ends in ${remainingTime}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedHeader;
