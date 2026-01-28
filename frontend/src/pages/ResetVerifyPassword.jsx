import { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
const ResetVerifyPassword = () => {
  const navigate = useNavigate();

  const {
    formData,
    setFormData,
    loading,
    setLoading,
    showPassword,
    setShowPassword,
  } = useContext(AuthContext);

  const inputsRef = useRef([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: formData.otp,
            password: formData.password,
          }),
          credentials: "include",
        },
      );

      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        handleError(data.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d?$/.test(value)) return;

    const otpArray = (formData.otp || "").split("");
    otpArray[index] = value;

    setFormData((prev) => ({
      ...prev,
      otp: otpArray.join(""),
    }));

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
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

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-[#1f1f23]">
        <div className="bg-[#111113] rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-xl sm:text-3xl font-bold text-[#fafafa] mb-2">
              Reset your password
            </h1>
            <p className="text-[#a3a3a3] text-sm sm:text-base">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-center gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  inputMode="numeric"
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="h-11 w-11 rounded-lg text-center text-lg bg-[#1c1c20] text-white border border-[#2a2a30] focus:border-orange-400 outline-none"
                />
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="w-full rounded-lg bg-[#18181b] border border-[#2a2a30] px-4 py-2 pr-12 text-white placeholder-gray-400 outline-none focus:border-orange-400"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className={`w-full rounded-lg bg-orange-400 py-3 font-bold text-black transition hover:bg-orange-300 ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
            >
              Reset password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetVerifyPassword;
