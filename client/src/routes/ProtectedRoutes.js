import React from "react";
/* eslint-disable */

/////////////////////// Admins //////////////////////////////
import AdminAdminManagement from "../Admin/AdminAdminManagement";
import AdminComment from "../Admin/AdminComment";
import AdminDashboard from "../Admin/AdminDashboard";
import AdminEditProfile from "../Admin/AdminEditProfile";
import AdminFeedback from "../Admin/AdminFeeback";
import AdminLeadsManagement from "../Admin/AdminLeadsManagement";
import AdminLegacy from "../Admin/AdminLegacy";
import AdminProjectManagement from "../Admin/AdminProjectManagement";
import AdminUsersManagement from "../Admin/AdminUsersManagement";
import AdminViewProfile from "../Admin/AdminViewProfile";

import UserAddedProjects from "../Users/UserAddedProjects";
import UserAllProjects from "../Users/UserAllProjects";
import UserComment from "../Users/UserComment";
import { default as UserDashboard } from "../Users/UserDashboard";
import UserEditProfile from "../Users/UserEditProfile";
import UserFeedback from "../Users/UserFeedback";
import UserLegacy from "../Users/UserLegacy";
import UserProjectInfo from "../Users/UserProjectInfo";
import UserViewProfile from "../Users/UserViewProfile";

const protectedRoutes = [
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    roles: ["Admin"],
  },
  {
    path: "/admin/projects",
    element: <AdminProjectManagement />,
    roles: ["Admin"],
  },
  {
    path: "/admin/users",
    element: <AdminUsersManagement />,
    roles: ["Admin"],
  },
  {
    path: "/admin/leads",
    element: <AdminLeadsManagement />,
    roles: ["Admin"],
  },
  {
    path: "/admin/admins",
    element: <AdminAdminManagement />,
    roles: ["Admin"],
  },
  {
    path: "/admin/projects/comment/:id",
    element: <AdminComment />,
    roles: ["Admin"],
  },
  {
    path: "/admin/view/:id",
    element: <AdminViewProfile />,
    roles: ["Admin"],
  },
  {
    path: "/admin/edit/:id",
    element: <AdminEditProfile />,
    roles: ["Admin"],
  },
  {
    path: "/admin/legacy",
    element: <AdminLegacy />,
    roles: ["Admin"],
  },
  {
    path: "/admin/feedback",
    element: <AdminFeedback />,
    roles: ["Admin"],
  },

  {
    path: "/user/dashboard",
    element: <UserDashboard />,
    roles: ["User", "Lead"],
  },

  {
    path: "/user/mastersheet",
    element: <UserAllProjects />,
    roles: ["User", "Lead"],
  },
  {
    path: "/user/projects/comment/:id",
    element: <UserComment />,
    roles: ["User", "Lead"],
  },

  {
    path: "/user/projects/info/:id",
    element: <UserProjectInfo />,
    roles: ["User", "Lead"],
  },
  {
    path: "/user/view/:id",
    element: <UserViewProfile />,
    roles: ["User", "Lead"],
  },
  {
    path: "/user/edit/:id",
    element: <UserEditProfile />,
    roles: ["User", "Lead"],
  },
  {
    path: "/user/watchlist",
    element: <UserAddedProjects />,
    roles: ["User", "Lead"],
  },
  {
    path: "/user/feedback",
    element: <UserFeedback />,
    roles: ["User", "Lead"],
  },
  {
    path: "/user/legacy",
    element: <UserLegacy />,
    roles: ["User", "Lead"],
  },
  // {
  //   path: "user/dashboard",
  //   element: <UserProjectMangement />,
  //   roles: ["Lead", "User", "Owner"],
  // },
];

export default protectedRoutes;
