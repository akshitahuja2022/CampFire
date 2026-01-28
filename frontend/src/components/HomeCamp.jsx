import React, { useContext, useEffect } from "react";
import { handleError } from "../notify/Notification";
import { AuthContext } from "../context/authContext";
import Loader from "./Loader";
import { FaUserGroup } from "react-icons/fa6";
import { Link } from "react-router-dom";

const HomeCamp = () => {
  const { loading, setLoading, personalisedCamps, setPpersonalisedCamps } =
    useContext(AuthContext);
  useEffect(() => {
    const personalisedCamps = async () => {
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

    personalisedCamps();
  }, [setLoading, setPpersonalisedCamps]);

  if (loading) {
    return <Loader />;
  }

  if (!personalisedCamps || personalisedCamps.length === 0) {
    return (
      <div className="p-4 sm:p-5 rounded-xl bg-[#111113] border border-[#1f1f23] text-[#a3a3a3]">
        <h2 className="text-base sm:text-lg font-semibold text-white">
          No activity yet.
        </h2>
        <p className="mt-1 text-xs sm:text-sm mb-6">
          We couldn’t find any camps matching your interests. Update your
          interests to see personalized content.
        </p>
        <Link
          to="/settings/add-interest"
          className={`px-4 py-2 sm:py-2 bg-orange-400 text-black font-semibold rounded-lg hover:bg-orange-500 text-sm sm:text-base ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Add interests
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:m-2">
      {personalisedCamps.map((camp) => (
        <div
          key={camp._id}
          className="flex mx-auto justify-between gap-4
                 bg-gradient-to-b from-[#0f0f11] to-[#0b0b0d]
                 border border-[#1f1f23] rounded-2xl p-5
                 hover:border-orange-500 transition"
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              {camp.category.map((cat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded-full
                         bg-[#18181b] border border-[#27272a]
                         text-gray-300"
                >
                  {cat}
                </span>
              ))}
            </div>

            <h3 className="text-white text-lg sm:text-xl font-semibold truncate">
              {camp.title}
            </h3>

            <p className="text-sm text-gray-400 mt-1 line-clamp-2 max-w-2xl">
              {camp.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaUserGroup />
                <span>{camp.totalUsers}</span>
              </div>

              <button className="px-4 py-1.5 text-sm rounded-lg bg-orange-500 text-black font-bold hover:bg-orange-400 transition shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeCamp;
