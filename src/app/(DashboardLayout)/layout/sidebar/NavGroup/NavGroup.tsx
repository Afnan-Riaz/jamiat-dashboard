// mui imports
import {
    Collapse,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    styled,
    useTheme,
} from "@mui/material";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { MenuItem } from "../SidebarItems";
import { useState } from "react";
type NavGroup = {
    navlabel?: boolean;
    subheader?: string;
    items: any;
};

const NavGroup = ({ item, onClick }: any) => {
    const theme = useTheme();
    const { items: children } = item;
    const Icon = item.icon;
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen((prev) => !prev);
    };
    const ListItemStyled = styled(ListItem)(() => ({
        whiteSpace: "nowrap",
        marginBottom: "8px",
        cursor: "pointer",
        padding: "8px 10px",
        borderRadius: "8px",
        color: theme.palette.text.secondary,
        paddingLeft: "10px",
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
        },
        "&.Mui-selected": {
            color: "white",
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: "white",
            },
        },
    }));
    return (
        <List>
            <ListItemStyled onClick={handleClick}>
                <ListItemIcon
                    sx={{
                        minWidth: "36px",
                        p: "3px 0",
                        color: "inherit",
                    }}
                >
                    {item.icon ? <Icon stroke={1.5} size="1.3rem" /> : <></>}
                </ListItemIcon>
                <ListItemText primary={item.title} />
                {open ? <IconChevronUp /> : <IconChevronDown />}
            </ListItemStyled>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {children.map((child: any, key: any) => (
                        <MenuItem key={key} item={child} onclick={onClick} />
                    ))}
                </List>
            </Collapse>
        </List>
    );
};

export default NavGroup;
