import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: formData.otp,
            password: formData.password,
          }),
          credentials: "include",
        },
      );

      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        handleError(result.message);
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

    setFormData((prev) => ({ ...prev, otp: otpArray.join("") }));

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full flex justify-center px-4 py-10">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Reset your password
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="
                  h-11 w-11 rounded-xl text-center text-lg font-semibold
                  bg-bg border border-border
                  text-text-primary
                  outline-none focus:border-accent
                "
              />
            ))}
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-text-primary">
              New password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
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

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-2.5 rounded-xl font-semibold
              bg-accent hover:bg-accent-hover
              text-black transition
              ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetVerifyPassword;
