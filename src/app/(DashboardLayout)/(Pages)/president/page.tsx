"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
    Grid,
    Stack,
    TextField,
    Button,
    AlertProps,
    Alert,
    Snackbar,
    styled,
    FormLabel,
} from "@mui/material";
import BaseCard from "@/app/(DashboardLayout)/components/shared/BaseCard";
import mongoose from "mongoose";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { IconUpload } from "@tabler/icons-react";

interface President {
    _id: object;
    name: string;
    designation: string;
    image: string;
    content: string;
}
const HiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});
const getData = async () => {
    const data = await fetch(`/api/profiles/president`).then((response) =>
        response.json()
    );
    return data;
};

const setData = async (data: President) => {
    const result = await fetch(`/api/profiles/president`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
    if (result.success) return result;
    throw new Error("Error while saving data");
};
const ObjectId = mongoose.Types.ObjectId;

export default function President() {
    const [row, setRow] = useState<President>({
        _id: new ObjectId(),
        image: "",
        name: "",
        designation: "",
        content: "",
    });
    const router = useRouter();
    const [snackbar, setSnackbar] = React.useState<Pick<
        AlertProps,
        "children" | "severity"
    > | null>(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [fileState, setFileState] = React.useState<File | undefined>();
    const validateForm = () => {
        if (
            row._id &&
            row.name != "" &&
            row.designation != "" &&
            row.image != "" &&
            row.content != ""
        )
            return true;
        throw new Error();
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setRow((prevRow) => ({ ...prevRow, [id]: value }));
    };
    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        fetch(`/api/upload`, {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("HTTP Error: " + response.status);
                }
                return response.json();
            })
            .catch((error) => {
                console.error("File upload failed. Error: " + error.message);
            });
    };
    const handleCancel = () => {
        router.back();
    };

    const handleSubmit = async () => {
        setIsLoaded(false);
        try {
            validateForm();
            if (fileState && fileState.type.startsWith("image/")) {
                await uploadImage(fileState);
            }
            await setData(row);
            setIsLoaded(true);
            setSnackbar({
                children: "Inspiration successfully Saved.",
                severity: "success",
            });
        } catch (error) {
            setIsLoaded(true);

            setSnackbar({
                children: "An error occured.",
                severity: "error",
            });
        }
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target?.files;
        if (files && files.length > 0) {
            setFileState(files[0]);
            row.image = "/" + files[0].name;
        }
    };
    useEffect(() => {
        const populateForm = async () => {
            const data = await getData();
            console.log(data);
            setRow(data);
            setIsLoaded(true);
        };
        populateForm();
    }, []);
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                    <BaseCard title="Edit President's Biography">
                        {isLoaded ? (
                            <>
                                <Stack spacing={5}>
                                    <TextField
                                        label="Name"
                                        variant="outlined"
                                        id="name"
                                        value={row?.name}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Designation"
                                        variant="outlined"
                                        id="designation"
                                        value={row?.designation}
                                        onChange={handleChange}
                                    />

                                    <Stack
                                        direction={"row"}
                                        spacing={2}
                                        alignItems={"center"}
                                    >
                                        <FormLabel>Image:</FormLabel>
                                        <Button
                                            component="label"
                                            variant="contained"
                                            sx={{
                                                justifyContent: "start",
                                                width: "150px",
                                                paddingInline: "6px",
                                                whiteSpace: "nowrap",
                                                overflowX: "hidden",
                                            }}
                                            startIcon={<IconUpload />}
                                        >
                                            {row?.image
                                                ? row.image
                                                : "Upload Image"}
                                            <HiddenInput
                                                type="file"
                                                onChange={(e) =>
                                                    handleFileChange(e)
                                                }
                                                multiple={false}
                                                accept="image/*"
                                            />
                                        </Button>
                                    </Stack>
                                    <TextField
                                        label="Biography"
                                        multiline
                                        rows={12}
                                        id="content"
                                        value={row?.content}
                                        onChange={handleChange}
                                    />
                                </Stack>
                                <br />
                                <Stack direction={"row"} spacing={2}>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        onClick={handleSubmit}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        variant="outlined"
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </>
                        ) : (
                            <Loading />
                        )}
                    </BaseCard>
                </Grid>
            </Grid>
            {!!snackbar && (
                <Snackbar
                    open
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                    onClose={handleCloseSnackbar}
                    autoHideDuration={1000}
                >
                    <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
            )}
        </>
    );
}
