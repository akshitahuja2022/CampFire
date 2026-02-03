import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { formData, setFormData, loading, setLoading, setLoginUser } =
    useContext(AuthContext);

  const inputsRef = useRef([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.otp || formData.otp.length !== 6) {
      handleError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: formData.otp }),
          credentials: "include",
        },
      );

      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        localStorage.setItem("user", JSON.stringify(data.data));
        setLoginUser(data.data);
        setTimeout(() => navigate("/"), 1000);
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

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/auth/resend-otp`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        setFormData((prev) => ({ ...prev, otp: "" }));
        inputsRef.current[0]?.focus();
      } else {
        handleError(data.message || "Failed to resend code");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-text-primary">
            Verify your account
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                inputMode="numeric"
                autoComplete="one-time-code"
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="
                  w-11 h-11 sm:w-12 sm:h-12
                  rounded-xl text-center text-lg
                  bg-bg border border-border
                  text-text-primary
                  outline-none focus:border-accent
                "
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 rounded-xl font-bold
              bg-accent hover:bg-accent-hover
              text-black transition
              ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            Verify OTP
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            className="w-full text-sm font-semibold text-accent hover:text-accent-hover"
          >
            Resend code
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
