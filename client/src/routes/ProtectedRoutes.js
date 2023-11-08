import React from "react";
/* eslint-disable */
// import UserProjectMangement from "../Users/UserProjectMangement";

/////////////////////// Admins //////////////////////////////
import AdminProjectManagement from "../Admin/AdminProjectManagement";
import AdminUsersManagement from "../Admin/AdminUsersManagement";
import AdminLeadsManagement from "../Admin/AdminLeadsManagement";
import AdminComment from "../Admin/AdminComment";
import AdminDashboard from "../Admin/AdminDashboard";
import AdminLegacy from "../Admin/AdminLegacy";
import AdminAddedProjects from "../Admin/AdminAddedProjects";
import AdminViewProfile from "../Admin/AdminViewProfile";
import AdminFeedback from "../Admin/AdminFeeback";

import UserProjectManagement from "../Users/UserProjectManagement";
// import UserUsersManagement from "../User/UserUsersManagement";
// import UserLeadsManagement from "../User/UserLeadsManagement";
import UserComment from "../Users/UserComment";
import UserDashboard from "../Users/UserDashboard";
import UserProjectInfo from "../Users/UserProjectInfo";
import UserViewProfile from "../Users/UserViewProfile";
import UserAllProjects from "../Users/UserAllProjects";
import UserAddedProjects from "../Users/UserAddedProjects";
import UserFeedback from "../Users/UserFeedback";
import UserLegacy from "../Users/UserLegacy";

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
    path: "/admin/projects/comment/:id",
    element: <AdminComment />,
    roles: ["Admin"],
  },
  {
    path: "/admin/view",
    element: <AdminViewProfile />,
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
    path: "/admin/watchlist",
    element: <AdminAddedProjects />,
    roles: ["Admin"],
  },
  {
    path: "/user/dashboard",
    element: <UserProjectManagement />,
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
    path: "/user/view",
    element: <UserViewProfile />,
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
