import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiTrash2 } from "react-icons/fi";

const UploadAvatar = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const { loading, setLoading, setLoginUser, loginUser } =
    useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return handleError("Please select an image");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);

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
        setTimeout(() => navigate("/settings/account"), 1500);
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
        setTimeout(() => navigate("/settings/account"), 1500);
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
    <div className="w-full flex justify-center px-4 py-10">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Profile photo
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Upload or change your avatar
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-border bg-bg">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : loginUser?.avatar?.url || "/user-avatar.png"
              }
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          </div>

          <label
            htmlFor="uploadAvatar"
            className="
              cursor-pointer text-sm font-semibold
              text-accent hover:text-accent-hover
            "
          >
            Choose a new photo
          </label>

          <input
            id="uploadAvatar"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            hidden
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleRemoveAvatar}
            disabled={loading}
            className="
              flex items-center justify-center gap-2
              px-5 py-2.5 rounded-xl
              border border-border
              bg-surface text-text-secondary
              hover:text-red-400 hover:border-red-400
              transition
            "
          >
            <FiTrash2 size={16} />
            Remove
          </button>

          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className={`
              flex-1 flex items-center justify-center gap-2
              px-5 py-2.5 rounded-xl font-semibold
              bg-accent hover:bg-accent-hover
              text-black transition
              ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <FiUpload size={16} />
            Save avatar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadAvatar;
