import { HomeIcon, Mic, Bell, User } from "lucide-react";
import Index from "./pages/Index.jsx";
import EchoCreationScreen from "./components/EchoCreationScreen.jsx";
import NotificationsScreen from "./components/NotificationsScreen.jsx";
import ProfileScreen from "./components/ProfileScreen.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Record",
    to: "/record",
    icon: <Mic className="h-4 w-4" />,
    page: <EchoCreationScreen />,
  },
  {
    title: "Notifications",
    to: "/notifications",
    icon: <Bell className="h-4 w-4" />,
    page: <NotificationsScreen />,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <User className="h-4 w-4" />,
    page: <ProfileScreen />,
  },
];