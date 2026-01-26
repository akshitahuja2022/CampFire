import { useState } from "react";
import { AuthContext } from "./authContext";

export const AuthContextProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activetab, setActiveTab] = useState("homeCamp");

  return (
    <AuthContext.Provider
      value={{
        formData,
        setFormData,
        loading,
        setLoading,
        showPassword,
        setShowPassword,
        activetab,
        setActiveTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
