import { useContext } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
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
    setLoginUser,
  } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKNED_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        localStorage.setItem("user", JSON.stringify(data.data));
        setLoginUser(data.data);
        setTimeout(() => navigate("/"), 1500);
      } else {
        handleError(data.message);
      }

      setFormData({ username: "", password: "" });
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
      <div className="w-full max-w-md">
        <div
          className="
            bg-surface border border-border
            rounded-2xl p-8 sm:p-10
            shadow-[0_0_40px_rgba(0,0,0,0.4)]
          "
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="
                text-3xl sm:text-4xl font-extrabold
                bg-gradient-to-r from-accent to-accent-hover
                bg-clip-text text-transparent
              "
            >
              Welcome Back
            </h1>
            <p className="text-text-secondary text-sm sm:text-base mt-2">
              Rekindle your session to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-bg text-text-primary
                  border border-border
                  placeholder:text-text-muted
                  focus:border-accent focus:ring-1 focus:ring-accent/40
                  transition-all outline-none
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="
                    w-full px-4 py-2.5 rounded-xl
                    bg-bg text-text-primary
                    border border-border
                    placeholder:text-text-muted
                    focus:border-accent focus:ring-1 focus:ring-accent/40
                    transition-all outline-none
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    text-text-muted hover:text-accent
                    transition-colors
                  "
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* CTA */}
            <button
              disabled={loading}
              type="submit"
              className={`
                w-full mt-4 py-3 rounded-xl
                bg-accent hover:bg-accent-hover
                text-black font-bold
                shadow-lg
                transition-all
                hover:scale-[1.02] active:scale-[0.98]
                ${loading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              Enter the Camp
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm font-semibold">
              Don’t have an account?
              <Link
                to="/signup"
                className="ml-1 text-accent hover:text-accent-hover transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
