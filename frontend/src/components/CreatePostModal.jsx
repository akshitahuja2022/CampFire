import { useContext } from "react";
import { FiX, FiImage } from "react-icons/fi";
import { AuthContext, CampContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";
import { useParams } from "react-router-dom";

const CreatePostModal = () => {
  const { id } = useParams();
  const { loading, setLoading } = useContext(AuthContext);

  const {
    open,
    setOpen,
    setPosts,
    content,
    setContent,
    imagePreview,
    setImagePreview,
    imageFile,
    setImageFile,
  } = useContext(CampContext);

  if (!open) return null;

  const closeModal = () => {
    setOpen(false);
    setContent("");
    setImagePreview(null);
    setImageFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", content);
      if (imageFile) formData.append("post", imageFile);

      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/post/create/${id}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setPosts((prev) => [result.data, ...prev]);
        closeModal();
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
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      />

      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-3">
        <div
          className="
            w-full sm:max-w-xl
            bg-surface border border-border
            rounded-t-3xl sm:rounded-2xl
            p-4 sm:p-6
            animate-slideUp
          "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-1.5 bg-border rounded-full sm:hidden" />
            <h2 className="hidden sm:block text-lg font-semibold text-text-primary">
              Create post
            </h2>
            <button
              onClick={closeModal}
              className="p-2 rounded-full hover:bg-bg transition"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What’s happening?"
              rows={imagePreview ? 3 : 5}
              required
              className="
                w-full resize-none rounded-xl
                bg-bg border border-border
                p-3 text-sm sm:text-base
                outline-none
              "
            />

            {imagePreview && (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-72 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="
                    absolute top-2 right-2
                    bg-bg/80 backdrop-blur
                    p-1.5 rounded-full
                  "
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-text-primary transition">
                <FiImage className="w-5 h-5" />
                <span className="text-sm">Add image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

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
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePostModal;
