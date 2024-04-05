import { Navigate, Outlet, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";

function GuestGuard() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/ads" />;
  }

  return <Outlet />;
}

GuestGuard.propTypes = {
  children: PropTypes.any,
};

export default GuestGuard;
