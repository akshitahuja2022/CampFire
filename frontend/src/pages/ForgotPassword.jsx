import { useContext } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { formData, setFormData, loading, setLoading } =
    useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
          credentials: "include",
        },
      );

      const result = await response.json();

      if (result.success) {
        handleSuccess(result.message);
        setTimeout(() => navigate("/reset-password"), 2000);
      } else {
        handleError(result.message);
      }
      setFormData({
        email: "",
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-[#1f1f23]">
        <div className="bg-[#111113] rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl text-[#fafafa] sm:text-4xl font-bold mb-2">
              Forgot password
            </h1>
            <p className="text-[#a3a3a3] text-sm sm:text-base">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="mb-3">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#fafafa] mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg transition-all duration-200  placeholder-gray-400 bg-[#18181b] text-white border border-[#1f1f23] outline-none"
                aria-label="Email Address"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className={`w-full bg-orange-400 hover:bg-orange-300 text-black font-bold py-3 px-4 rounded-lg shadow-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Reset password
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#a3a3a3] text-sm sm:text-md font-bold">
              Remember your password?
              <Link
                to="/signup"
                className="text-white font-bold transition-colors duration-200 rounded px-1"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
