import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { loginUser } = useContext(AuthContext);
  return loginUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
