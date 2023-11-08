import React from "react";
/* eslint-disable */
// import UserProjectMangement from "../Users/UserProjectMangement";

/////////////////////// Admins //////////////////////////////
import AdminProjectManagement from "../Admin/AdminProjectManagement";
import AdminUsersManagement from "../Admin/AdminUsersManagement";
import AdminLeadsManagement from "../Admin/AdminLeadsManagement";
import AdminComment from "../Admin/AdminComment";
import AdminDashboard from "../Admin/AdminDashboard";
import AdminViewProfile from "../Admin/AdminViewProfile";

import UserProjectManagement from "../Users/UserProjectManagement";
// import UserUsersManagement from "../User/UserUsersManagement";
// import UserLeadsManagement from "../User/UserLeadsManagement";
import UserComment from "../Users/UserComment";
import UserDashboard from "../Users/UserDashboard";
import UserProjectInfo from "../Users/UserProjectInfo";
import UserViewProfile from "../Users/UserViewProfile";
import UserAllProjects from "../Users/UserAllProjects";

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
    path: "/users/dashboard",
    element: <UserProjectManagement />,
    roles: ["User", "Lead"],
  },

  {
    path: "/users/mastersheet",
    element: <UserAllProjects />,
    roles: ["User", "Lead"],
  },
  {
    path: "/users/projects/comment/:id",
    element: <UserComment />,
    roles: ["User", "Lead"],
  },

  {
    path: "/users/projects/info/:id",
    element: <UserProjectInfo />,
    roles: ["User", "Lead"],
  },
  {
    path: "/users/view",
    element: <UserViewProfile />,
    roles: ["User", "Lead"],
  },
  // {
  //   path: "user/dashboard",
  //   element: <UserProjectMangement />,
  //   roles: ["Lead", "User", "Owner"],
  // },
];

export default protectedRoutes;
