import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/signin" replace />; // Redirect to sign-in if not authenticated
  }

  return children;
};

export default ProtectedRoute;
