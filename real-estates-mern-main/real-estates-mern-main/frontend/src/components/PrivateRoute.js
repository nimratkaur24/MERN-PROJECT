import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "./Spinner";

const PrivateRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.users);

  if (loading) {
    return <Spinner />;
  }

  if (!loading) {
    return user && allowedRoles.includes(user?.role) ? (
      <Outlet />
    ) : (
      <Navigate to="/sign-in" state={{ from: location }} replace />
    );
  }
};

export default PrivateRoute;
