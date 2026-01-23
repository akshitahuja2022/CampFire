import { useContext } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";

const Login = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    loading,
    setLoading,
  } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        },
      );

      const data = await response.json();
      if (response.status === 403 && data.message === "Account not verified") {
        handleError(
          "Account not verified. Redirecting to verification page...",
        );
        navigate("/verify");
      } else if (data.success) {
        handleSuccess(data.message);
        setTimeout(() => navigate("/"), 2000);
      } else {
        handleError(data.message);
      }
      setFormData({
        username: "",
        password: "",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg border border-gray-200">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Rekindle your session to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 placeholder-gray-400 text-gray-900 outline-none"
                aria-label="Username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 pr-12 rounded-lg border-2 transition-all duration-200  placeholder-gray-400 text-gray-900 outline-none"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none rounded-md p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="h-5 w-5" />
                  ) : (
                    <IoEyeOutline className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* login Button */}
            <button
              disabled={loading}
              type="submit"
              className={`w-full bg-orange-400 hover:bg-orange-300 text-white font-bold py-3 px-4 rounded-lg shadow-lg mt-6 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Enter the Camp
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm sm:text-md font-bold">
              Don't have an account?
              <Link
                to="/signup"
                className="text-orange-400 font-bold transition-colors duration-200 rounded px-1"
              >
                SignUp
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
