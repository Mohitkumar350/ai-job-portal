import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children }) {
  const { currentUser, firebaseUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (
    currentUser.email &&
    (!firebaseUser || firebaseUser.emailVerified !== true)
  ) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;
