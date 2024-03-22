"use client";
import { Grid, Box, Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Analytics from "./components/dashboard/Analytics";
import Recent from "./components/dashboard/Recent";
import Calendar from "./components/dashboard/Calendar";

const Dashboard = () => {
    return (
        <PageContainer title="Dashboard" description="this is Dashboard">
            <Box mt={3}>
                <Typography variant="h1" mb={"30px"} textAlign={"center"}>
                    Welcome!
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Analytics />
                    </Grid>
                    <Grid item xs={6}>
                        <Recent />
                    </Grid>
                    <Grid item xs={6}>
                        <Calendar />
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
};

export default Dashboard;
