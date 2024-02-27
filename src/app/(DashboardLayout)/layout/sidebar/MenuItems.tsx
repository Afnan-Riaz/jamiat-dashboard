import {
  IconPointFilled, IconUserCircle,IconHome, IconSourceCode
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconHome,
    href: "/",
  },
  {
    id: uniqueId(),
    title:"Users",
    icon:IconUserCircle,
    href:"/users",
  },
  {
    id: uniqueId(),
    title:"Meta Data",
    icon:IconSourceCode,
    href:"/metadata",
  },
  {
    id: uniqueId(),
    title: "Homepage",
    icon: IconPointFilled,
    href: "/homepage",
  },
  {
    id: uniqueId(),
    subheader:"About Us"
  },
  {
    id: uniqueId(),
    title: "Team",
    icon: IconPointFilled,
    href: "/team",
  },
  {
    id: uniqueId(),
    title: "Message",
    icon: IconPointFilled,
    href: "/message",
  },
  {
    id: uniqueId(),
    title: "Inspiration",
    icon: IconPointFilled,
    href: "/inspirations",
  },
  {
    id: uniqueId(),
    subheader:"Literature"
  },
  {
    id: uniqueId(),
    title: "Books",
    icon: IconPointFilled,
    href: "/books",
  },
  {
    id: uniqueId(),
    title: "Magazine",
    icon: IconPointFilled,
    href: "/magazine",
  },
  {
    id: uniqueId(),
    title: "Blogs",
    icon: IconPointFilled,
    href: "/blogs",
  },
  {
    id: uniqueId(),
    subheader:"Activities and Events"
  },
  {
    id: uniqueId(),
    title: "Activities",
    icon: IconPointFilled,
    href: "/activities",
  },
  {
    id: uniqueId(),
    title: "Events",
    icon: IconPointFilled,
    href: "/events",
  },
  {
    id: uniqueId(),
    title: "Projects",
    icon: IconPointFilled,
    href: "/projects",
  },
  {
    id: uniqueId(),
    subheader:"Media and News"
  },

  {
    id: uniqueId(),
    title: "Press Releases",
    icon: IconPointFilled,
    href: "/releases",
  },
  {
    id: uniqueId(),
    title: "Images",
    icon: IconPointFilled,
    href: "/images",
  },
  {
    id: uniqueId(),
    title: "Videos",
    icon: IconPointFilled,
    href: "/videos",
  },
  {
    id: uniqueId(),
    title: "Audio",
    icon: IconPointFilled,
    href: "/audio",
  },
];

export default Menuitems;
