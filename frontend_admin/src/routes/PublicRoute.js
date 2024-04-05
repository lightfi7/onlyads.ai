import { Outlet } from "react-router-dom";
import { lazy } from "react";
import Loadable from "../components/Loadable";
import GuestGuard from "../guards/guestGuard";

const ForgotPassword = Loadable(
  lazy(() => import("../pages/Authentication/ForgotPassword"))
);
const ResetPassword = Loadable(
  lazy(() => import("../pages/Authentication/ResetPassword"))
);
const SignIn = Loadable(lazy(() => import("../pages/Authentication/Signin")));
const SignUp = Loadable(lazy(() => import("../pages/Authentication/Signup")));
const Welcome = Loadable(lazy(() => import("../pages/Welcome")));

export const publicRoutes = {
  path: "/",
  element: <GuestGuard />,
  children: [
    {
      path: "/",
      element: <Welcome />,
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
  ],
};
