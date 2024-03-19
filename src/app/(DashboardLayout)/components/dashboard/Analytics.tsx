"use client";
import { useEffect, useState } from "react";
import DashboardCard from "../shared/DashboardCard";
import BaseCard from "../shared/BaseCard";
import { Grid } from "@mui/material";
import Loading from "@/app/loading";

const colors = ["#d5f5e4", "#cff9fa", "#faead4", "#fcd7de"];
const getData = async () => {
    const data = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/count`
    ).then((response) => response.json());
    return data;
};
const Analytics = () => {
    const [counts, setCounts] = useState<any>(null);
    useEffect(() => {
        const getCounts = async () => {
            const count = await getData();
            setCounts(count);
        };
        getCounts();
    }, []);
    return (
        <BaseCard title="Analytics">
            <Grid container spacing={3}>
                {counts ? (
                    counts.map((count: any, index: number) => (
                        <Grid item xs={6} lg={3} key={index}>
                            <DashboardCard
                                subtitle={count.type}
                                title={count.count}
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

export default Analytics;
