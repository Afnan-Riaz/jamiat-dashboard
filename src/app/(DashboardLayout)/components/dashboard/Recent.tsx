"use client";

import React, { useEffect, useState } from "react";
import BaseCard from "../shared/BaseCard";
import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import Loading from "@/app/loading";
import {
    IconBulb,
    IconFilePencil,
    IconCalendarTime,
    IconUsersGroup,
} from "@tabler/icons-react";
const icons = [IconFilePencil, IconUsersGroup, IconCalendarTime, IconBulb];
const getData = async () => {
    const data = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/recent`
    ).then((response) => response.json());
    return data;
};

const Recent = () => {
    const [recents, setRecents] = useState<any>(null);
    useEffect(() => {
        const getRecents = async () => {
            const recent = await getData();
            setRecents(recent);
        };
        getRecents();
    }, []);
    return (
        <BaseCard title="Recent Updates">
            {recents ? (
                <List>
                    {recents.map((recent: any, index: number) => (
                        <>
                            <ListItem key={index}>
                                <ListItemAvatar>
                                    <Avatar sx={{ backgroundColor: "#a6a6a6" }}>
                                        {React.createElement(icons[index])}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={recent.type}
                                    secondary={recent.date}
                                />
                            </ListItem>
                            <Divider />
                        </>
                    ))}
                </List>
            ) : (
                <Loading />
            )}
        </BaseCard>
    );
};

export default Recent;
