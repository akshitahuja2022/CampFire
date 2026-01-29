import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";
import { useNavigate } from "react-router-dom";

const UploadAvatar = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const { loading, setLoading, setLoginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

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
        setTimeout(() => navigate("/settings/account"), 1000);
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
      <div className="w-full max-w-sm bg-[#111113] rounded-2xl shadow-lg p-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-[#fafafa] text-center">
            Upload Your Avatar
          </h2>
          <p className="text-sm text-[#a3a3a3] text-center mt-1">
            Upload a clear photo to personalize your profile
          </p>
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 bg-orange-400 text-black font-semibold rounded-lg transition  hover:bg-orange-500
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}
                `}
          >
            Upload Avatar
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadAvatar;
