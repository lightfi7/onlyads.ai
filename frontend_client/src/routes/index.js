import { useRoutes } from "react-router-dom";
import { privateRoutes } from "./PrivateRoute";
import { publicRoutes } from "./PublicRoute";
import { lazy } from "react";
import Loadable from "../components/Loadable";
const NotFound = Loadable(lazy(() => import("../pages/NotFound")));

export default function Routes() {
  return useRoutes([
    publicRoutes,
    privateRoutes,
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
}
