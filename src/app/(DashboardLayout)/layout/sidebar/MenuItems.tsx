import {
  IconPointFilled, IconUserCircle,IconHome, IconLayoutGrid, IconTable, IconSourceCode
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
    subheader:"Pages"
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
    title: "Activities",
    icon: IconPointFilled,
    href: "/activities",
  },
  {
    id: uniqueId(),
    title: "Projects",
    icon: IconPointFilled,
    href: "/projects",
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
  // {
  //   id: uniqueId(),
  //   title: "Forms",
  //   icon: IconTable,
  //   href: "/ui-components/forms",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Buttons",
  //   icon: IconCircleDot,
  //   href: "/ui-components/buttons",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Images",
  //   icon: IconPhoto,
  //   href: "/ui-components/images",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Pagination",
  //   icon: IconUser,
  //   href: "/ui-components/pagination",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Tables",
  //   icon: IconLayoutGrid,
  //   href: "/ui-components/table",
  // },
];

export default Menuitems;
