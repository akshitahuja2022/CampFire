import { FaUserGroup } from "react-icons/fa6";
import { handleError, handleSuccess } from "../notify/Notification";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CampContext } from "../context/authContext";

const CampsGrid = ({ camps }) => {
  const navigate = useNavigate();
  const { joinCamps, setJoinCamps, setYourCamps } = useContext(CampContext);

  const handleJoinCamp = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/camp/join/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(),
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
        } else {
          return;
        }

        setTimeout(() => navigate("/your-camps"), 2000);
      } else {
        handleError(result.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const isJoined = (campId) => joinCamps?.some((c) => c._id === campId);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:m-2">
        {camps.map((camp) => (
          <div
            key={camp._id}
            onClick={() => {
              navigate(`/camp-feed/${camp._id}`);
            }}
            className="bg-[#111113] border border-[#1f1f23] rounded-2xl p-4 hover:border-orange-500 cursor-pointer"
          >
            <div className="flex flex-wrap gap-2 mb-5">
              {camp.category.map((cat, i) => (
                <span
                  key={i}
                  className="px-4 py-2 text-xs rounded-full bg-[#18181b] border border-[#27272a] text-gray-300"
                >
                  {cat}
                </span>
              ))}
            </div>

            <h3 className="text-white text-xl font-semibold">{camp.title}</h3>
            <p className="text-md text-gray-400 line-clamp-2 mt-1">
              {camp.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaUserGroup />
                <span>{camp.totalUsers}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isJoined(camp._id)) {
                    handleJoinCamp(camp._id);
                  }
                }}
                className={`px-4 py-1.5 text-sm rounded-lg font-bold bg-orange-400 text-black transition shrink-0
                 ${isJoined(camp._id) ? "cursor-not-allowed" : "hover:bg-orange-500"}
               `}
              >
                {isJoined(camp._id) ? "Joined" : "Join"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampsGrid;
