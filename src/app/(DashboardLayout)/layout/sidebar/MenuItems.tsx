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
    title: "Our Team",
    icon: IconPointFilled,
    href: "/team",
  },
  {
    id: uniqueId(),
    title: "Forms",
    icon: IconTable,
    href: "/ui-components/forms",
  },
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
  {
    id: uniqueId(),
    title: "Tables",
    icon: IconLayoutGrid,
    href: "/ui-components/table",
  },
];

export default Menuitems;
