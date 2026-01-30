import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { handleError, handleSuccess } from "../notify/Notification";
import { useNavigate } from "react-router-dom";

const INTERESTS = [
  "Tech",
  "Art",
  "News",
  "Sports",
  "Nature",
  "Photography",
  "Music",
  "Gaming",
  "Education",
  "Startup",
];
const AddInterests = () => {
  const navigate = useNavigate();

  const {
    loading,
    setLoading,
    selectedInterests,
    setSelectedInterests,
    setLoginUser,
    loginUser,
  } = useContext(AuthContext);

  useEffect(() => {
    if (loginUser?.interests?.length) {
      setSelectedInterests(loginUser.interests);
    }
  }, [loginUser, setSelectedInterests]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleAddInterest = async (e) => {
    e.preventDefault();

    if (selectedInterests.length === 0) {
      handleError("Please select at least one interest");
      return;
    } else if (selectedInterests.length === INTERESTS.length) {
      handleError("You have Selected all interests");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/user/add/interests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interests: selectedInterests,
          }),
          credentials: "include",
        },
      );
      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setSelectedInterests(selectedInterests);
        setLoginUser((prev) => ({
          ...prev,
          interests: selectedInterests,
        }));
        setTimeout(() => navigate("/settings/account"), 2000);
      } else {
        handleError(result.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-3 sm:px-6 py-6 sm:py-10">
      <div className="max-w-xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Personalize Your Feed
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#a3a3a3] leading-relaxed">
            Choose topics you’re interested in to personalize your professional
            content.
          </p>
        </div>

        <div className="bg-[#111113] border border-[#1f1f23] rounded-xl">
          <form onSubmit={handleAddInterest} className="p-5 sm:p-8">
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
              {INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);

                return (
                  <button
                    key={interest}
                    type="button"
                    disabled={loading}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 sm:px-5 py-2 sm:py-2.5
                      rounded-full text-sm sm:text-base font-medium hover:text-[#fafafa] 
                      ${
                        isSelected
                          ? "bg-orange-400 text-black border-orange-400 hover:text-black"
                          : "bg-[#18181b] text-gray-300 border-[#1f1f23] hover:border-orange-400"
                      }
                    `}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col justify-end sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => navigate("/settings")}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-400 text-black font-semibold rounded-lg transition  hover:bg-orange-500
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                Add Interests
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInterests;
