import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state: any) => state.auth);

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};
