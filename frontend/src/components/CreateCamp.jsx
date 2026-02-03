import { useContext } from "react";
import { AuthContext, CampContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";
import { useNavigate } from "react-router-dom";

const CreateCamp = () => {
  const navigate = useNavigate();

  const categories = [
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

  const { loading, setLoading } = useContext(AuthContext);
  const { campForm, setCampForm, setYourCamps, setJoinCamps } =
    useContext(CampContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryClick = (category) => {
    setCampForm((prev) => {
      const alreadySelected = prev.category.includes(category);

      if (alreadySelected) {
        return {
          ...prev,
          category: prev.category.filter((c) => c !== category),
        };
      }

      if (prev.category.length >= 3) {
        handleError("You can select up to 3 categories only");
        return prev;
      }

      return { ...prev, category: [...prev.category, category] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/camp/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(campForm),
          credentials: "include",
        },
      );

      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setYourCamps((prev) => [...prev, result.data]);
        setJoinCamps((prev) => [...prev, result.data]);
        navigate("/your-camps");
      } else {
        handleError(result.message);
      }

      setCampForm({
        title: "",
        description: "",
        category: [],
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Create a Camp
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Start a new space around a topic you care about.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-text-primary">
              Camp Title
            </label>
            <input
              type="text"
              name="title"
              value={campForm.title}
              onChange={handleInputChange}
              placeholder="Late Night JavaScript"
              className="
                w-full px-3 py-2.5 rounded-xl
                bg-bg border border-border
                text-text-primary text-sm
                outline-none
                focus:border-accent
              "
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-text-primary">
              Description
            </label>
            <textarea
              rows={4}
              name="description"
              value={campForm.description}
              onChange={handleInputChange}
              placeholder="What is this camp about?"
              className="
                w-full resize-none px-3 py-2.5 rounded-xl
                bg-bg border border-border
                text-text-primary text-sm
                outline-none
                focus:border-accent
              "
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-text-primary">
              Categories (1–3)
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, i) => {
                const isSelected = campForm.category.includes(category);

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                    className={`
                      px-3 py-1.5 rounded-full text-sm font-semibold transition
                      ${
                        isSelected
                          ? "bg-accent text-black"
                          : "bg-bg border border-border text-text-muted hover:text-text-primary"
                      }
                    `}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/your-camps")}
              className="
                px-6 py-2.5 rounded-xl font-semibold
                bg-surface border border-border
                text-text-secondary hover:text-text-primary
                transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`
                px-6 py-2.5 rounded-xl font-semibold
                bg-accent hover:bg-accent-hover
                text-black transition
                ${loading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              Create Camp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCamp;
