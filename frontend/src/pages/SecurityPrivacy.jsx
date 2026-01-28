import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        },
      );
      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setFormData({
          oldPassword: "",
          newPassword: "",
        });
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="py-6 sm:py-8 md:py-4 px-2 sm:px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Security & Privacy</h2>
          <p className="text-sm sm:text-base text-[#a3a3a3] mt-2">
            Manage your account security and privacy settings
          </p>
        </div>

        <div className="bg-[#111113] rounded-lg overflow-hidden border border-[#1f1f23]">
          <form onSubmit={handleChangePassword}>
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-6 mb-8">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-md font-semibold text-[#fafafa] mb-3"
                  >
                    Current Password
                  </label>
                  <div className="relative mb-3">
                    <input
                      disabled={loading}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleInputChange}
                      placeholder="Enter your current password"
                      className="w-full px-2 py-2 pr-12 rounded-lg text-white placeholder-gray-400 bg-[#18181b] border border-[#1f1f23] outline-none"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#18181b] border border-[#1f1f23] transition-colors duration-200 focus:outline-none rounded-md p-1"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <IoEyeOffOutline className="h-5 w-5 text-white" />
                      ) : (
                        <IoEyeOutline className="h-5 w-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-md font-semibold text-[#fafafa] mb-3"
                  >
                    New Password
                  </label>
                  <div className="relative mb-3">
                    <input
                      disabled={loading}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter your new password"
                      className="w-full px-4 py-2 pr-12 rounded-lg text-white placeholder-gray-400 bg-[#18181b] border border-[#1f1f23] outline-none"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#18181b] border border-[#1f1f23] transition-colors duration-200 focus:outline-none rounded-md p-1"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <IoEyeOffOutline className="h-5 w-5 text-white" />
                      ) : (
                        <IoEyeOutline className="h-5 w-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-400 text-black font-semibold rounded-lg hover:bg-orange-500 text-sm sm:text-base ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      oldPassword: "",
                      newPassword: "",
                    });
                    navigate("/settings");
                  }}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>

          <div className="bg-[#111113] px-6 sm:px-8 md:px-10 py-4 border-t border-[#1f1f23]">
            <p className="text-xs sm:text-sm text-[#a3a3a3]">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPrivacy;
