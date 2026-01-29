import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";

const AccountProfile = () => {
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    <div className="py-6 sm:py-8 md:py-4 px-2 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-5 mb-4">
          <div className="relative w-32 h-32 sm:w-20 sm:h-20 mx-auto sm:mx-0">
            <img
              src={
                loginUser.avatar.url ? loginUser.avatar.url : "/user-avatar.png"
              }
              alt="user-profile"
              className="w-full h-full object-cover rounded-full border-4 border-[#1f1f23] shadow-lg"
            />
            <Link
              to="/settings/upload-avatar"
              className="absolute bottom-0 right-0 bg-white hover:bg-orange-400 p-2 rounded-full shadow-md transition"
            >
              <MdEdit className="text-black w-5 h-5 sm:w-3 sm:h-3" />
            </Link>
          </div>
          <div className="mt-1">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Account & Profile
            </h2>
            <p className="text-sm sm:text-base text-[#a3a3a3] mt-2">
              Manage your personal information and account settings
            </p>
          </div>
        </div>

        <div className="bg-[#111113] rounded-lg overflow-hidden border border-[#1f1f23]">
          <form onSubmit={handleUpdateProfile}>
            <div className="p-6 sm:p-8 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                <div className="flex flex-col justify-center">
                  <label className="text-sm sm:text-xl font-semibold text-[#fafafa] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className="w-full px-4 py-2 rounded-lg transition-all duration-200 placeholder-gray-400 bg-[#18181b] text-white border border-[#1f1f23] outline-none"
                    aria-label="Username"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <label className="text-sm sm:text-xl font-semibold text-[#fafafa] mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className="w-full px-4 py-2 rounded-lg transition-all duration-200 placeholder-gray-400 bg-[#18181b] text-white border border-[#1f1f23] outline-none"
                    aria-label="Username"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="text-sm sm:text-xl font-semibold text-[#fafafa] mb-2 block">
                  Email Address
                </label>
                <p className="text-md text-[#a3a3a3]">{loginUser?.email}</p>
              </div>

              <div className="mb-14">
                <label className="flex gap-3 text-sm sm:text-xl font-semibold text-[#fafafa] mb-5">
                  Your Interests{" "}
                  <span className="mt-2">
                    <Link to="/settings/add-interest">
                      <MdEdit size={17} />
                    </Link>
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {loginUser.interests.map((interest) => {
                    return (
                      <button
                        key={interest}
                        type="button"
                        className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium bg-orange-400 text-black border-orange-400"
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      name: loginUser.name,
                      username: loginUser.username,
                    })
                  }
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-400 text-black font-semibold rounded-lg hover:bg-orange-500 text-sm sm:text-base ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Update Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
