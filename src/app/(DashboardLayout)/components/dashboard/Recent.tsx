"use client";
import { useEffect, useState } from "react";
import DashboardCard from "../shared/DashboardCard";
import BaseCard from "../shared/BaseCard";
import { Grid } from "@mui/material";
import Loading from "@/app/loading";

const colors = ["#d5f5e4", "#cff9fa", "#faead4", "#fcd7de"];
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
            <Grid container spacing={3}>
                {recents ? (
                    recents.map((recent: any, index: number) => (
                        <Grid item xs={6} lg={3}>
                            <DashboardCard
                                subtitle={recent.type}
                                title={recent.date}
                                color={colors[index % colors.length]}
                            ></DashboardCard>
                        </Grid>
                    ))
                ) : (
                    <Loading />
                )}
            </Grid>
        </BaseCard>
    );
};

export default Recent;
