"use client";
import React from "react";
import {
    Box,
    AppBar,
    Toolbar,
    styled,
    Stack,
    IconButton,
    Button,
} from "@mui/material";
import PropTypes from "prop-types";
import { IconMenu2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
interface ItemType {
    toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
    const router = useRouter();
    const AppBarStyled = styled(AppBar)(({ theme }) => ({
        boxShadow: "none",
        background: theme.palette.background.paper,
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        [theme.breakpoints.up("lg")]: {
            minHeight: "70px",
        },
    }));
    const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
        width: "100%",
        color: theme.palette.text.secondary,
    }));
    const handleLogout = async () => {
        await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN}/api/users/logout`
        ).then((response) => {
            if (response.status === 200) router.push("/login");
        });

    };
    return (
        <AppBarStyled position="sticky" color="default">
            <ToolbarStyled>
                <IconButton
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleMobileSidebar}
                    sx={{
                        display: {
                            lg: "none",
                            xs: "inline",
                        },
                    }}
                >
                    <IconMenu2 width="20" height="20" />
                </IconButton>
                <Box flexGrow={1} />
                <Stack spacing={1} direction="row" alignItems="center">
                    <Button
                        fullWidth
                        onClick={handleLogout}
                        variant="contained"
                        color="error"
                    >
                        Logout
                    </Button>
                </Stack>
            </ToolbarStyled>
        </AppBarStyled>
    );
};

Header.propTypes = {
    sx: PropTypes.object,
};

export default Header;
