import React from "react";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";

type Props = {
    title?: string|number;
    subtitle?: string|number;
    action?: JSX.Element | any;
    footer?: JSX.Element;
    cardheading?: string | JSX.Element;
    headtitle?: string | JSX.Element;
    headsubtitle?: string | JSX.Element;
    children?: JSX.Element;
    middlecontent?: string | JSX.Element;
    color?: string;
};

const DashboardCard = ({
    title,
    subtitle,
    children,
    footer,
    cardheading,
    headtitle,
    headsubtitle,
    middlecontent,
    color,
}: Props) => {
    return (
        <Card sx={{ padding: 0, backgroundColor:color }} elevation={9} variant={undefined}>
            {cardheading ? (
                <CardContent>
                    <Typography variant="h3">{headtitle}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                        {headsubtitle}
                    </Typography>
                </CardContent>
            ) : (
                <CardContent sx={{ p: "20px" }}>
                    {title ? (
                        <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems={"center"}
                            // mb={3}
                        >
                            <Box>
                                {title ? (
                                    <Typography variant="h1">
                                        {title}
                                    </Typography>
                                ) : (
                                    ""
                                )}

                            </Box>
							{subtitle ? (
								<Typography
									variant="h4"
									color="textSecondary"
								>
									{subtitle}
								</Typography>
							) : (
								""
							)}
                        </Stack>
                    ) : null}

                    {children}
                </CardContent>
            )}

            {middlecontent}
            {footer}
        </Card>
    );
};

export default DashboardCard;
