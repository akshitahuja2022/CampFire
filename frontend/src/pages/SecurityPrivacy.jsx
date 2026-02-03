import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { handleError, handleSuccess } from "../notify/Notification";
import { useNavigate } from "react-router-dom";

const SecurityPrivacy = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    loading,
    setLoading,
    showPassword,
    setShowPassword,
  } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!formData.oldPassword || !formData.newPassword) {
      handleError("All fields are required");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      handleError("New password must be different");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/user/update/password`,
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
        setFormData({ oldPassword: "", newPassword: "" });
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
    <div className="w-full flex justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Security & Privacy
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Update your password to keep your account secure
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl">
          <form
            onSubmit={handleChangePassword}
            className="p-6 sm:p-8 space-y-6"
          >
            <div>
              <label className="block mb-2 text-sm font-semibold text-text-primary">
                Current password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Enter current password"
                  className="
                    w-full px-3 py-2.5 rounded-xl
                    bg-bg border border-border
                    text-text-primary text-sm
                    outline-none focus:border-accent
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={18} />
                  ) : (
                    <IoEyeOutline size={18} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-text-primary">
                New password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Enter new password"
                className="
                  w-full px-3 py-2.5 rounded-xl
                  bg-bg border border-border
                  text-text-primary text-sm
                  outline-none focus:border-accent
                "
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({ oldPassword: "", newPassword: "" });
                  navigate("/settings");
                }}
                className="
                  px-6 py-2.5 rounded-xl font-semibold
                  bg-surface border border-border
                  text-text-secondary hover:text-text-primary
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
                Change password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SecurityPrivacy;
