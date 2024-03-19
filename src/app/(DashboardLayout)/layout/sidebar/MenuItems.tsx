import {
    IconPointFilled,
    IconUserCircle,
    IconHome,
    IconSourceCode,
    IconSettings,
    IconInfoCircle,
    IconBook,
    IconCalendarEvent,
    IconNews,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const MenuItems = [
    {
        id: uniqueId(),
        icon: IconSettings,
        title: "Dashboard",
        href: "/",
        items: [],
    },
    {
        id: uniqueId(),
        icon: IconUserCircle,
        title: "Users",
        href: "/users",
        items: [],
    },
    {
        id: uniqueId(),
        href: "/metadata",
        icon: IconSourceCode,
        title: "Meta Data",
    },
    {
        id: uniqueId(),
        icon: IconHome,
        title: "Homepage",
        items: [
            {
                id: uniqueId(),
                title: "Banners & Analytics",
                href: "/homepage",
            },
            {
                id: uniqueId(),
                title: "Magazine",
                href: "/magazine",
            },
            {
                id: uniqueId(),
                title: "Inspiration",
                href: "/inspirations",
            },
            {
                id: uniqueId(),
                title: "President's Message",
                href: "/message",
            },
            {
                id: uniqueId(),
                title: "Activities",
                href: "/activities",
            },
            {
                id: uniqueId(),
                title: "Projects",
                href: "/projects",
            },
            {
                id: uniqueId(),
                title: "Events",
                href: "/events",
            },
            {
                id: uniqueId(),
                title: "Press Releases",
                href: "/releases",
            },
            {
                id: uniqueId(),
                title: "Audio",
                href: "/audio",
            },
            {
                id: uniqueId(),
                title: "Videos",
                href: "/videos",
            },
        ],
    },
    {
        id: uniqueId(),
        icon: IconInfoCircle,
        title: "About Us",
        items: [
            {
                id: uniqueId(),
                title: "Team",
                href: "/team",
            },
            {
                id: uniqueId(),
                title: "Message",
                href: "/message",
            },
            {
                id: uniqueId(),
                title: "Inspiration",
                href: "/inspirations",
            },
        ],
    },
    {
        id: uniqueId(),
        icon: IconBook,
        title: "Literature",
        items: [
            {
                id: uniqueId(),
                title: "Books",
                href: "/books",
            },
            {
                id: uniqueId(),
                title: "Magazine",
                href: "/magazine",
            },
            {
                id: uniqueId(),
                title: "Blogs",
                href: "/blogs",
            },
        ],
    },
    {
        id: uniqueId(),
        icon: IconCalendarEvent,
        title: "Activities and Events",
        items: [
            {
                id: uniqueId(),
                title: "Activities",
                href: "/activities",
            },
            {
                id: uniqueId(),
                title: "Events",
                href: "/events",
            },
            {
                id: uniqueId(),
                title: "Projects",
                href: "/projects",
            },
        ],
    },
    {
        id: uniqueId(),
        icon: IconNews,
        title: "Media and News",
        items: [
            {
                id: uniqueId(),
                title: "Press Releases",
                href: "/releases",
            },
            {
                id: uniqueId(),
                title: "Images",
                href: "/images",
            },
            {
                id: uniqueId(),
                title: "Videos",
                href: "/videos",
            },
            {
                id: uniqueId(),
                title: "Audio",
                href: "/audio",
            },
        ],
    },
];
export default MenuItems;
