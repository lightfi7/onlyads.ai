import MainLayout from "../layouts/MainLayout";
import { lazy } from "react";
import Loadable from "../components/Loadable";
import AuthGuard from "../guards/authGuard";

const Dashboard = Loadable(lazy(() => import("../pages/Dashboard")));
const AdDetails = Loadable(lazy(() => import("../pages/Dashboard/AdDetails")));
// const Pricing = Loadable(lazy(() => import("../pages/Pricing")));
const Setting = Loadable(lazy(() => import("../pages/Setting")));
// const Payment = Loadable(lazy(() => import("../pages/Payment")));
const Users = Loadable(lazy(() => import("../pages/Users")));
const UserDetails = Loadable(lazy(() => import("../pages/Users/UserDetails")));
const Products = Loadable(lazy(() => import("../pages/Products")));
const TopProducts = Loadable(lazy(() => import("../pages/TopProducts")));
const TopStores = Loadable(lazy(() => import("../pages/TopStores")));
const Nexus = Loadable(lazy(() => import("../pages/Nexus")));
const Amazon = Loadable(lazy(() => import("../pages/Amazon")));

export const privateRoutes = {
  path: "/",
  element: <AuthGuard />,
  children: [
    {
      path: "/",
      element: <MainLayout />,
      // loader: ,
      children: [
        {
          path: "/ads",
          element: <Dashboard />,
        },
        {
          path: "/details/:id",
          element: <AdDetails />,
        },
        // {
        //   path: "/pricing",
        //   element: <Pricing />,
        // },
        // {
        //   path: "/payment",
        //   element: <Payment />,
        // },
        {
          path: "/setting",
          element: <Setting />,
        },
        {
          path: "/users",
          element: <Users />,
        },
        {
          path: "/users/view/:id",
          element: <UserDetails />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/top-products",
          element: <TopProducts />,
        },
        {
          path: "/top-stores",
          element: <TopStores />,
        },
        {
          path: "/nexus-hot",
          element: <Nexus />,
        },
        {
          path: "/nexus-trending",
          element: <Nexus />,
        },
        {
          path: "/nexus-rise",
          element: <Nexus />,
        },
        {
          path: "/nexus-new",
          element: <Nexus />,
        },
        {
          path: "/nexus-all",
          element: <Nexus />,
        },
        {
          path: "/marketplaces/amazon",
          element: <Amazon />,
        },
      ],
    },
  ],
};
