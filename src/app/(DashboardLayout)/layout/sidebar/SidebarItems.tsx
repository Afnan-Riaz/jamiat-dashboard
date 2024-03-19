import React, { useState } from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";

function hasChildren(item: any) {
    const { items: children } = item;

    if (children === undefined) {
        return false;
    }

    if (children.constructor !== Array) {
        return false;
    }

    if (children.length === 0) {
        return false;
    }

    return true;
}

export const MenuItem = ({ item, onClick }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;
  return hasChildren(item) ? (
    <NavGroup item={item} key={item.id} onClick={onClick} />
  ) : (
    <NavItem
      item={item}
      key={item.id}
      pathDirect={pathDirect}
      onClick={onClick}
    />
  );
};

const SidebarItems = ({ toggleMobileSidebar }: any) => {
    return (
        <Box sx={{ px: 2 }}>
            <List sx={{ pt: 0 }} className="sidebarNav" component="div">
                {Menuitems.map((item, key) => <MenuItem key={key} item={item} onClick={toggleMobileSidebar}/>)}
            </List>
        </Box>
    );
};
export default SidebarItems;
