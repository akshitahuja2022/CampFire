import { FaUserGroup } from "react-icons/fa6";
import { handleError, handleSuccess } from "../notify/Notification";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CampContext } from "../context/authContext";

const CampsGrid = ({ camps }) => {
  const navigate = useNavigate();
  const { joinCamps, setJoinCamps, setYourCamps } = useContext(CampContext);

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

        const joinedCamp = camps.find((camp) => camp._id === id);
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

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-1 sm:px-2">
      {camps.map((camp) => (
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

            <button
              onClick={(e) => {
                if (!isJoined(camp._id)) {
                  handleJoinCamp(camp._id, e);
                } else {
                  e.stopPropagation();
                }
              }}
              className={`
                px-4 py-1.5 rounded-full text-sm font-semibold
                transition
                ${
                  isJoined(camp._id)
                    ? "bg-surface text-text-muted border border-border cursor-not-allowed"
                    : "bg-accent hover:bg-accent-hover text-black"
                }
              `}
            >
              {isJoined(camp._id) ? "Joined" : "Join"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampsGrid;
