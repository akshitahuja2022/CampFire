import { useContext, useEffect, useState } from "react";
import { AuthContext, CampContext } from "../context/authContext";
import { handleError } from "../notify/Notification";
import CampsGrid from "./CampsGrid";
import Loader from "./Loader";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { FaTrophy } from "react-icons/fa6";

const TopCharts = () => {
  const { loading, setLoading } = useContext(AuthContext);
  const { trendingCamps, setTrendingCamps, topCamps, setTopCamps } =
    useContext(CampContext);

  const [activeTab, setActiveTab] = useState("trending");

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        setLoading(true);

        const endpoint =
          activeTab === "trending"
            ? "/api/v1/camp/trending"
            : "/api/v1/camp/top";

        const response = await fetch(
          `${import.meta.env.VITE_BACKNED_URL}${endpoint}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const result = await response.json();

        if (activeTab === "trending") {
          setTrendingCamps(result.data.camps);
        } else {
          setTopCamps(result.data.camps);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    if (
      (activeTab === "trending" && trendingCamps.length > 0) ||
      (activeTab === "top" && topCamps.length > 0)
    ) {
      return;
    }

    fetchCamps();
  }, [
    activeTab,
    setLoading,
    setTrendingCamps,
    setTopCamps,
    trendingCamps.length,
    topCamps.length,
  ]);

  if (loading) return <Loader />;

  const emptyState =
    activeTab === "trending" ? "No trending camps yet" : "No top camps yet";

  return (
    <>
      <div className="flex gap-2 mb-6 px-2">
        <button
          onClick={() => setActiveTab("trending")}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition
            ${
              activeTab === "trending"
                ? "bg-accent text-black"
                : "bg-bg border border-border text-text-muted hover:text-text-primary"
            }
          `}
        >
          <HiMiniArrowTrendingUp className="text-base" />
          Trending
        </button>

        <button
          onClick={() => setActiveTab("top")}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition
            ${
              activeTab === "top"
                ? "bg-accent text-black"
                : "bg-bg border border-border text-text-muted hover:text-text-primary"
            }
          `}
        >
          <FaTrophy className="text-sm" />
          Top
        </button>
      </div>

      {activeTab === "trending" && trendingCamps.length === 0 && (
        <div className="p-5 rounded-2xl bg-surface border border-border text-text-secondary">
          {emptyState}
        </div>
      )}

      {activeTab === "top" && topCamps.length === 0 && (
        <div className="p-5 rounded-2xl bg-surface border border-border text-text-secondary">
          {emptyState}
        </div>
      )}

      {activeTab === "trending" && trendingCamps.length > 0 && (
        <CampsGrid camps={trendingCamps} />
      )}

      {activeTab === "top" && topCamps.length > 0 && (
        <CampsGrid camps={topCamps} />
      )}
    </>
  );
};

export default TopCharts;
