import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthGuard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return navigate("/signin");
  }
  return <Outlet />;
};

export default AuthGuard;
