import React, { useContext, useEffect, useState } from "react";
import { AuthContext, CampContext } from "../context/authContext";
import { handleError } from "../notify/Notification";
import CampsGrid from "./CampsGrid";
import Loader from "./Loader";
const TopCharts = () => {
  const { setLoading, loading } = useContext(AuthContext);
  const { trendingCamps, setTrendingCamps, topCamps, setTopCamps } =
    useContext(CampContext);

  const [activeTab, setActiveTab] = useState("trending");

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        setLoading(true);

        const [trendingRes, topRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKNED_URL}/api/v1/camp/trending`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${import.meta.env.VITE_BACKNED_URL}/api/v1/camp/top`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        const trendingData = await trendingRes.json();
        const topData = await topRes.json();
        setTrendingCamps(trendingData.data.camps);
        setTopCamps(topData.data.camps);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCamps();
  }, [setLoading, setTopCamps, setTrendingCamps]);

  if (loading) {
    return <Loader />;
  }

  if (!trendingCamps || trendingCamps.length === 0) {
    return (
      <div className="p-4 sm:p-5 rounded-xl bg-[#111113] border border-[#1f1f23] text-[#a3a3a3]">
        <h2 className="text-base sm:text-lg font-semibold text-white">
          No Trending Camps Yet
        </h2>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2 mb-5 p-2">
        <button
          onClick={() =>
            setActiveTab((prev) => (prev === "trending" ? "top" : "trending"))
          }
          className={`px-4 py-2 text-sm font-bold rounded-2xl transition bg-[#18181b] border border-[#27272a]
            ${
              activeTab === "trending"
                ? "bg-orange-400 text-black"
                : "bg-orange-400 text-black"
            }`}
        >
          {activeTab === "trending" ? "🔥 Trending" : "🏆 Top"}
        </button>
      </div>

      {activeTab === "trending" && (
        <section>
          <CampsGrid camps={trendingCamps} />
        </section>
      )}

      {activeTab === "top" && (
        <section>
          <CampsGrid camps={topCamps} />
        </section>
      )}
    </>
  );
};

export default TopCharts;
