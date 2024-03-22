"use client";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const data = new FormData(event.currentTarget);
        const body = {
            username: data.get("username"),
            password: data.get("password"),
        };
        const result = await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN}/api/users`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        ).then(async (response) => {
            const data = await response.json();
            return { status: response.status, message: data.message };
        });
        if (result.status === 200) {
            router.push("/");
        } else {
            setError(result.message);
            setLoading(false);
        }
    };
    return (
        <Grid container component="main" sx={{ height: "100vh" }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: "url(/images/jamiat-image.png)",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: (t) =>
                        t.palette.mode === "light"
                            ? t.palette.grey[50]
                            : t.palette.grey[900],
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    paddingBlock: "50px",
                    backgroundOrigin: "content-box",
                }}
            />
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
            >
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h2">
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, fontSize: "1rem" }}
                        >
                            {loading ? (
                                <CircularProgress
                                    color="inherit"
                                    sx={{ maxHeight: "30px", maxWidth: "30px" }}
                                />
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                        {error ? <Alert severity="error">{error}</Alert> : ""}
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}
