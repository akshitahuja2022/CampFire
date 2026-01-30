import React, { useContext } from "react";
import { AuthContext, CampContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";
import { useNavigate } from "react-router-dom";

const CreateCamp = () => {
  const navigate = useNavigate();
  const categories = [
    "Tech",
    "Art",
    "News",
    "Sports",
    "Nature",
    "Photography",
    "Music",
    "Gaming",
    "Educaton",
    "Startup",
  ];

  const { loading, setLoading } = useContext(AuthContext);
  const { campForm, setCampForm } = useContext(CampContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      return {
        ...prev,
        category: [...prev.category, category],
      };
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(campForm),
          credentials: "include",
        },
      );
      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        setTimeout(() => navigate("/your-camps"), 2000);
      } else {
        handleError(data.message);
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
    <div className="w-full md:w-4/5 lg:w-1/2 h-fit m-5 mx-auto px-5 py-5 flex flex-col justify-center bg-[#111113] rounded-md border border-[#1f1f23]">
      <div className="mb-4">
        <h2 className="text-lg md:text-xl font-semibold mb-1">Create a Camp</h2>
        <p className="text-sm md:text-sm text-[#a3a3a3]">
          Start a new space around a topic you care about.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            className="block mb-2 font-semibold text-sm md:text-base"
            htmlFor="camptitle"
          >
            Camp Title
          </label>
          <input
            className="px-2 w-full outline-none bg-[#18181b] border border-[#1f1f23] py-1 md:py-2 rounded-md text-sm md:text-base"
            type="text"
            name="title"
            value={campForm.title}
            onChange={handleInputChange}
            placeholder="eg. Late Night JavaScript"
          />
        </div>
        <div>
          <label
            className="block mb-2 font-semibold text-sm md:text-base"
            htmlFor="campdesc"
          >
            Description
          </label>
          <textarea
            rows={4}
            className="resize-none px-2 w-full outline-none bg-[#18181b] border border-[#1f1f23] py-1 md:py-2 rounded-md text-sm md:text-base"
            value={campForm.description}
            name="description"
            onChange={handleInputChange}
            placeholder="What is this camp about?"
          />
        </div>
        <div>
          <label
            className="block mb-2 font-semibold text-sm md:text-base"
            htmlFor="categories"
          >
            Categories (1-3)
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => {
              const isSelected = campForm.category.includes(category);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={`px-3 md:px-4 py-1 rounded-2xl text-sm md:text-base border transition-colors
          ${
            isSelected
              ? "bg-orange-400 text-black border-orange-400"
              : "bg-[#18181b] text-[#a3a3a3] border-[#1f1f23] hover:bg-[#252529] hover:text-[#fafafa]"
          }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
        <hr className="border-[#1f1f23]" />
        <button
          disabled={loading}
          type="submit"
          className={`w-full md:w-auto md:ml-auto block px-4 md:px-6 py-2 md:py-3 bg-orange-400 text-black font-semibold rounded-lg hover:bg-orange-500 transition-colors text-sm md:text-base ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Create Camp
        </button>
      </form>
    </div>
  );
};

export default CreateCamp;
