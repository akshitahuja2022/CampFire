import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { FaUserGroup } from "react-icons/fa6";
import { handleError } from "../notify/Notification";
import { FaRegClock } from "react-icons/fa";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const YourCamp = () => {
  const navigate = useNavigate();
  const { loading, setLoading, yourCamps, setYourCamps } =
    useContext(AuthContext);

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKNED_URL}/api/v1/camp/my-camps`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const result = await response.json();
        setYourCamps(result.data.camps);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCamps();
  }, [setLoading, setYourCamps]);

  if (loading) {
    return <Loader />;
  }

  if (!yourCamps || yourCamps.length === 0) {
    return (
      <div className="p-4 sm:p-5 rounded-xl bg-[#111113] border border-[#1f1f23] text-[#a3a3a3]">
        <h2 className="text-base sm:text-lg font-semibold text-white">
          Your Camps
        </h2>
        <p className="mt-1 text-xs sm:text-sm">
          Camps you’ve joined will appear here.
        </p>
      </div>
    );
  }

  const getRemainingTime = (burnAt) => {
    const now = new Date();
    const end = new Date(burnAt);

    const diffMs = end - now;

    if (diffMs <= 0) return "Expired";

    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    if (days > 0) {
      return `${days}d ${hours}hr`;
    }

    return `${hours}hr`;
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:m-2">
      {yourCamps.map((camp) => (
        <div
          key={camp._id}
          onClick={() => navigate("/camp-feed")}
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
            <span className="flex gap-2 px-2 py-2 text-[10px] sm:text-xs rounded-full bg-orange-500/10 text-orange-400">
              <FaRegClock className="text-[10px] sm:text-xs mt-0.5" />
              {getRemainingTime(camp.burnAt)}
            </span>
          </div>

          <h3 className="text-white text-xl font-semibold">{camp.title}</h3>
          <p className="text-md text-gray-400 line-clamp-2 mt-1">
            {camp.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-400 mt-4">
            <FaUserGroup />
            <span>{camp.totalUsers}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YourCamp;
