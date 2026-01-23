import  { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { handleError, handleSuccess } from "../notify/Notification";

const VerifyOtp = () => {
  const navigate = useNavigate();

  const { formData, setFormData, loading, setLoading } =
    useContext(AuthContext);

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
          body: JSON.stringify({ code: formData.otp }),
          credentials: "include",
        },
      );

      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        setTimeout(() => navigate("/"), 2000);
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
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg border border-gray-200">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">
              Enter Verification Code
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              We've sent 6-digit otp to your email.
              <span className="block">
                Enter it below to ignite your session.
              </span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex justify-center gap-2 sm:gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  inputMode="numeric"
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center outline-none text-base sm:text-lg md:text-xl border border-orange-400 rounded-lg"
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            <button
              disabled={loading}
              type="submit"
              className={`w-full bg-orange-400 hover:bg-orange-300 text-white font-bold py-3 px-4 rounded-lg shadow-lg mt-6 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Verify Otp
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm sm:text-md font-bold">
              Didn't receive a otp?
              <Link
                to="/signup"
                className="text-orange-400 font-bold transition-colors duration-200 rounded px-1"
              >
                Resend Code
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
