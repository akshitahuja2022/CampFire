import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";

const AccountProfile = () => {
  const navigate = useNavigate();

  const {
    formData,
    setFormData,
    loginUser,
    loading,
    setLoading,
    setLoginUser,
  } = useContext(AuthContext);

  useEffect(() => {
    if (loginUser) {
      setFormData({
        name: loginUser.name,
        username: loginUser.username,
      });
    }
  }, [loginUser, setFormData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (
      formData.name === loginUser.name &&
      formData.username === loginUser.username
    ) {
      handleError("No changes detected in your profile");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/user/update/profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        },
      );
      const result = await response.json();

      if (result.success) {
        handleSuccess(result.message);
        setLoginUser((prev) => ({
          ...prev,
          name: formData.name,
          username: formData.username,
        }));
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
      {/* HEADER */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative">
          <img
            src={loginUser.avatar?.url || "/user-avatar.png"}
            alt="profile"
            className="
              w-28 h-28 rounded-full object-cover
              border-4 border-border
              bg-surface
            "
          />
          <Link
            to="/settings/upload-avatar"
            className="
              absolute bottom-1 right-1
              bg-accent hover:bg-accent-hover
              text-black
              p-2 rounded-full
              shadow-lg transition
            "
          >
            <MdEdit size={18} />
          </Link>
        </div>

        <h1 className="mt-4 text-2xl font-bold text-text-primary">
          {loginUser.name}
        </h1>
        <p className="text-text-secondary">@{loginUser.username}</p>
      </div>

      {/* CARD */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleUpdateProfile} className="space-y-8">
          {/* EDIT FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-bg text-text-primary
                  border border-border
                  placeholder:text-text-muted
                  focus:border-accent focus:ring-1 focus:ring-accent/40
                  outline-none transition
                "
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Username
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-bg text-text-primary
                  border border-border
                  placeholder:text-text-muted
                  focus:border-accent focus:ring-1 focus:ring-accent/40
                  outline-none transition
                "
              />
            </div>
          </div>

          {/* EMAIL (READ ONLY) */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1">
              Email
            </label>
            <p className="text-text-secondary text-sm">{loginUser?.email}</p>
          </div>

          {/* INTERESTS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary">
                Your Interests
              </h3>
              <Link
                to="/settings/add-interest"
                className="text-accent hover:text-accent-hover"
              >
                <MdEdit size={16} />
              </Link>
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {loginUser.interests.map((interest) => (
                <span
                  key={interest}
                  className="
                    shrink-0
                    px-4 py-2 rounded-full
                    bg-accent/15 text-accent
                    text-sm font-medium
                  "
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: loginUser.name,
                  username: loginUser.username,
                });
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
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountProfile;
