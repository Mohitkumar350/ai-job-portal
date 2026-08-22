import { Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

function RoleRoute({ allowedRoles, children }) {
  const location = useLocation();
  const { currentUser } = useAuth();

  return (
    <ProtectedRoute>
      <RoleContent
        allowedRoles={allowedRoles}
        location={location}
        user={currentUser}
      >
        {children}
      </RoleContent>
    </ProtectedRoute>
  );
}

function RoleContent({ allowedRoles, children, location, user }) {
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default RoleRoute;
