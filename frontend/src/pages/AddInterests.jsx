import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";
import { useNavigate } from "react-router-dom";

const INTERESTS = [
  "tech",
  "art",
  "news",
  "sports",
  "nature",
  "photography",
  "music",
  "gaming",
  "education",
  "startup",
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
    }
    if (selectedInterests.length === INTERESTS.length) {
      handleError("You don’t need *everything*");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/user/add/interests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interests: selectedInterests }),
          credentials: "include",
        },
      );

      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setLoginUser((prev) => ({
          ...prev,
          interests: selectedInterests,
        }));
        navigate(-1);
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
    <div className="px-4 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Personalize Your Feed
        </h2>
        <p className="mt-2 text-text-secondary text-sm sm:text-base">
          Choose topics you’re interested in. You can always change this later.
        </p>
      </div>

      {/* Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleAddInterest}>
          {/* Interests */}
          <div className="flex flex-wrap gap-3 mb-8">
            {INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);

              return (
                <button
                  key={interest}
                  type="button"
                  disabled={loading}
                  onClick={() => toggleInterest(interest)}
                  className={`
                    px-4 py-2 rounded-full
                    text-sm font-medium
                    transition-all
                    ${
                      isSelected
                        ? "bg-accent text-black"
                        : "bg-bg text-text-secondary border border-border hover:border-accent"
                    }
                  `}
                >
                  {interest}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedInterests(loginUser?.interests || []);
                navigate(-1);
              }}
              className="
                px-6 py-2.5 rounded-xl
                border border-border
                text-text-primary
                hover:bg-bg transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`
                px-6 py-2.5 rounded-xl
                bg-accent hover:bg-accent-hover
                text-black font-semibold
                transition
                ${loading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              Save Interests
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInterests;
