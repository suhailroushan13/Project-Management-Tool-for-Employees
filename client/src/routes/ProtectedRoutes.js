import React from "react";
import data from "../dashboard/data.json";
// Dashboard
// import EventManagement from "../dashboard/EventManagement";
// import SalesMonitoring from "../dashboard/SalesMonitoring";
// import WebsiteAnalytics from "../dashboard/WebsiteAnalytics";
import ProjectManagement from "../dashboard/ProjectManagement";
import Dashboard from "../dashboard/Dashboard";
// import Cryptocurrency from "../dashboard/Cryptocurrency";
// import HelpdeskService from "../dashboard/HelpdeskService";
// import StorageManagement from "../dashboard/StorageManagement";
import UserManagement from "../dashboard/UserManagement";
import LeadsManagement from "../dashboard/LeadsManagement";
import Comment from "../dashboard/Comment";
// import TableManagement from "../dashboard/TableManagement";

// Apps
// import GalleryMusic from "../apps/GalleryMusic";
// import GalleryVideo from "../apps/GalleryVideo";
// import Tasks from "../apps/Tasks";
// import Contacts from "../apps/Contacts";
// import Chat from "../apps/Chat";
// import AppCalendar from "../apps/AppCalendar";
// import Email from "../apps/Email";
// import FileManager from "../apps/FileManager";

// Pages
// import Pricing from "../pages/Pricing";
// import Faq from "../pages/Faq";
// import Profile from "../pages/Profile";
// import People from "../pages/People";
// import Activity from "../pages/Activity";
// import Events from "../pages/Events";
// import Settings from "../pages/Settings";

// UI Elements
// import LayoutColumns from "../docs/LayoutColumns";
// import LayoutGrid from "../docs/LayoutGrid";
// import LayoutGutters from "../docs/LayoutGutters";
// import Accordions from "../docs/Accordions";
// import Alerts from "../docs/Alerts";
// import Avatars from "../docs/Avatars";
// import Badges from "../docs/Badges";
// import Breadcrumbs from "../docs/Breadcrumbs";
// import Buttons from "../docs/Buttons";
// import Cards from "../docs/Cards";
// import Carousels from "../docs/Carousels";
// import Dropdowns from "../docs/Dropdowns";
// import Images from "../docs/Images";
// import Listgroup from "../docs/Listgroup";
// import Markers from "../docs/Markers";
// import Modals from "../docs/Modals";
// import NavTabs from "../docs/NavTabs";
// import OffCanvas from "../docs/OffCanvas";
// import Paginations from "../docs/Paginations";
// import Placeholders from "../docs/Placeholders";
// import Popovers from "../docs/Popovers";
// import Progress from "../docs/Progress";
// import Spinners from "../docs/Spinners";
// import Toasts from "../docs/Toasts";
// import Tooltips from "../docs/Tooltips";
// import Tables from "../docs/Tables";
// import FormElements from "../docs/FormElements";
// import FormSelects from "../docs/FormSelects";
// import FormChecksRadios from "../docs/FormChecksRadios";
// import FormRange from "../docs/FormRange";
// import FormPickers from "../docs/FormPickers";
// import FormLayouts from "../docs/FormLayouts";
// import UtilBackground from "../docs/UtilBackground";
// import UtilBorder from "../docs/UtilBorder";
// import UtilColors from "../docs/UtilColors";
// import UtilDivider from "../docs/UtilDivider";
// import UtilFlex from "../docs/UtilFlex";
// import UtilSizing from "../docs/UtilSizing";
// import UtilSpacing from "../docs/UtilSpacing";
// import UtilOpacity from "../docs/UtilOpacity";
// import UtilPosition from "../docs/UtilPosition";
// import UtilTypography from "../docs/UtilTypography";
// import UtilShadows from "../docs/UtilShadows";
// import UtilExtras from "../docs/UtilExtras";
// import ApexCharts from "../docs/ApexCharts";
// import ChartJs from "../docs/ChartJs";
// import MapLeaflet from "../docs/MapLeaflet";
// import MapVector from "../docs/MapVector";
// import IconRemix from "../docs/IconRemix";
// import IconFeather from "../docs/IconFeather";

const protectedRoutes = [
  { path: "dashboard/projects", element: <ProjectManagement data={data} /> },
  {
    path: "dashboard/projects/comment/:id",
    element: <Comment projectData={data} />,
  },

  { path: "dashboard/users", element: <UserManagement /> },
  { path: "dashboard/leads", element: <LeadsManagement /> },
  { path: "dashboard", element: <Dashboard /> },
  { path: "test", element: <div>Test Route</div> },

  // { path: "dashboard/events", element: <EventManagement /> },
  // { path: "dashboard/sales", element: <SalesMonitoring /> },
  // { path: "dashboard/analytics", element: <WebsiteAnalytics /> },
  // { path: "dashboard/crypto", element: <Cryptocurrency /> },
  // { path: "dashboard/helpdesk", element: <HelpdeskService /> },
  // { path: "dashboard/storage", element: <StorageManagement /> },
  // { path: "apps/gallery-music", element: <GalleryMusic /> },
  // { path: "apps/gallery-video", element: <GalleryVideo /> },
  // { path: "apps/tasks", element: <Tasks /> },
  // { path: "apps/contacts", element: <Contacts /> },
  // { path: "apps/chat", element: <Chat /> },
  // { path: "apps/calendar", element: <AppCalendar /> },
  // { path: "apps/email", element: <Email /> },
  // { path: "apps/file-manager", element: <FileManager /> },
  // { path: "pages/pricing", element: <Pricing /> },
  // { path: "pages/faq", element: <Faq /> },
  // { path: "pages/profile", element: <Profile /> },
  // { path: "pages/people", element: <People /> },
  // { path: "pages/activity", element: <Activity /> },
  // { path: "pages/events", element: <Events /> },
  // }
];

export default protectedRoutes;
