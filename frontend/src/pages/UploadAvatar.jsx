import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";
import { useNavigate } from "react-router-dom";

const UploadAvatar = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const { loading, setLoading, setLoginUser, loginUser } =
    useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return handleError("Please select a file");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);
      handleSuccess("Please wait a minute, uploading your avatar...");

      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/user/update/avatar`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setLoginUser((prev) => ({
          ...prev,
          avatar: result.data,
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

  const handleRemoveAvatar = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/user/update/avatar`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setLoginUser((prev) => ({
          ...prev,
          avatar: result.data,
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111113] rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-5 mb-5">
          <div className="relative w-24 h-24 sm:w-20 sm:h-20 mx-auto sm:mx-0">
            <img
              src={
                loginUser.avatar.url ? loginUser.avatar.url : "/user-avatar.png"
              }
              alt="user-profile"
              className="w-full h-full object-cover rounded-full border-4 border-[#1f1f23] shadow-lg"
            />
          </div>
          <div className="mt-2 mb-5">
            <h2 className="text-xl font-semibold text-[#fafafa] text-center">
              Upload Your Avatar
            </h2>
            <p className="text-sm text-[#a3a3a3] text-center mt-1">
              Upload a clear photo to personalize your profile
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label
            htmlFor="uploadAvatar"
            className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[#1f1f23] rounded-xl p-6 cursor-pointer hover:border-orange-500 transition"
          >
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#a3a3a3] text-sm">Preview</span>
              )}
            </div>

            <p className="text-sm font-semibold text-[#a3a3a3]">
              Click to upload image
            </p>
          </label>

          <input
            id="uploadAvatar"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            hidden
          />

          <div className="flex flex-col sm:flex-row sm:mx-auto gap-3 sm:gap-5 ">
            <button
              onClick={handleRemoveAvatar}
              type="button"
              disabled={loading}
              className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 bg-orange-400 text-black font-semibold rounded-lg transition  hover:bg-orange-500
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
              Remove Avatar
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 bg-orange-400 text-black font-semibold rounded-lg transition  hover:bg-orange-500
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
              Upload Avatar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadAvatar;
