import { useContext, useEffect } from "react";
import { AuthContext, CampContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";
import { FaUserGroup } from "react-icons/fa6";
import { useParams } from "react-router-dom";

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
        const normalizedCamp = {
          ...camp,
        };

        setJoinCamps((prev) => [...prev, normalizedCamp]);
        setYourCamps((prev) => [...prev, normalizedCamp]);
      } else {
        handleError(result.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const isJoined = (campId) =>
    Array.isArray(joinCamps) && joinCamps.some((c) => c._id === campId);
  return (
    <header className="sticky top-0 z-20 bg-[#111113] border border-[#1f1f23] mt-2 mb-2 px-4 py-4 md:px-6 rounded-lg">
      <div className="mx-auto flex flex-row sm:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
        <div className="min-w-0">
          <h1 className="text-white text-lg sm:text-2xl font-semibold mb-2">
            {camp?.title}
          </h1>
          <p className="text-gray-400 text-sm mt-1 line-clamp-2 mb-2">
            {camp?.description}
          </p>
          <p className="flex gap-1 text-[#a3a3a3] text-md">
            <FaUserGroup size={14} className="mt-1.5" />
            <span>
              {camp?.totalUsers} member{camp?.totalUsers > 1 ? "s" : ""}
            </span>
          </p>
        </div>

        <div className="flex-shrink-0 mt-2 md:mt-0">
          <button
            onClick={() => {
              if (!isJoined(camp._id)) {
                handleJoinCamp(camp._id);
              }
            }}
            className={`px-4 py-1.5 text-sm rounded-lg font-bold bg-orange-400 text-black transition shrink-0
                 ${isJoined(camp?._id) ? "cursor-not-allowed" : "hover:bg-orange-500"}
               `}
          >
            {isJoined(camp?._id) ? "Joined" : "Join"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default FeedHeader;
