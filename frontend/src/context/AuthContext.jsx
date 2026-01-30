import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";

export const AuthContextProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginUser, setLoginUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [selectedInterests, setSelectedInterests] = useState([]);

  const isLogin = !!loginUser;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const verifyUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKNED_URL}/api/v1/user/me`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const result = await response.json();
        setLoginUser(result.data);
        localStorage.setItem("user", JSON.stringify(result.data));
      } catch {
        setLoginUser(null);
        localStorage.removeItem("user");
      }
    };

    verifyUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        formData,
        setFormData,
        loading,
        setLoading,
        showPassword,
        setShowPassword,
        loginUser,
        setLoginUser,
        isLogin,
        selectedInterests,
        setSelectedInterests,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
