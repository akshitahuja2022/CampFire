import { useContext } from "react";
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

      setFormData({ email: "" });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
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
            Forgot password
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            No worries, we’ll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-semibold text-text-primary">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="
                w-full px-3 py-2.5 rounded-xl
                bg-bg border border-border
                text-text-primary text-sm
                outline-none
                focus:border-accent
              "
              required
            />
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

        <div className="mt-6 text-center text-sm text-text-secondary">
          Remember your password?
          <Link
            to="/login"
            className="ml-1 font-semibold text-text-primary hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
