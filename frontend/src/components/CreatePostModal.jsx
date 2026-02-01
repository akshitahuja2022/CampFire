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

      if (imageFile) {
        formData.append("post", imageFile);
      }

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
        setOpen(false);
        setContent("");
        setImagePreview(null);
        setImageFile(null);
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
        className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="m-4 lg:m-0 lg:ml-60 fixed inset-0 z-40 flex items-end sm:items-center justify-center">
        <div
          className="relative w-full sm:max-w-xl md:max-w-lg xl:max-w-2xl rounded-lg p-4 md:p-6 bg-[#0f0f11] border border-[#1f1f23]"
          role="dialog"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Create Your Post</h2>
            <button
              onClick={() => {
                setOpen(false);
                setContent("");
                setImagePreview(null);
                setImageFile(null);
              }}
              className="p-2 rounded-full hover:bg-orange-400 hover:text-black"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={imagePreview ? 3 : 4}
              className="w-full resize-none rounded-lg outline-none bg-[#18181b] border border-[#1f1f23] p-3 text-md"
              required
            />

            <div className="space-y-2">
              {imagePreview && (
                <div className="relative rounded-lg">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-full max-h-60 mx-auto object-center rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 bg-[#111113] text-[#a3a3a3] rounded-full p-1"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer text-md text-[#a3a3a3] hover:text-[#fafafa]">
                <FiImage className="w-5 h-5" />
                <span>Add image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setContent("");
                  setImagePreview(null);
                  setImageFile(null);
                }}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-400 text-black font-semibold rounded-lg hover:bg-orange-500 text-sm sm:text-base ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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
