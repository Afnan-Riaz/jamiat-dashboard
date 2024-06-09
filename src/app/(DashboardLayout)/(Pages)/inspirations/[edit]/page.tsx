"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
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
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import BaseCard from "@/app/(DashboardLayout)/components/shared/BaseCard";
import mongoose from "mongoose";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { IconUpload } from "@tabler/icons-react";

interface Inspiration {
    _id: object;
    meta_title?: string;
    meta_description?: string;
    name: string;
    designation: string;
    canonical?: string;
    slug?: string;
    image: string;
    content: string;
    dob: string;
    dod?: string;
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
const getData = async (id: string) => {
    const data = await fetch(`/api/profiles/inspirations/${id}`).then(
        (response) => response.json()
    );
    return data;
};

const setData = async (data: Inspiration) => {
    const result = await fetch(`/api/profiles/inspirations`, {
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

export default function Edit({ params }: any) {
    const [row, setRow] = useState<Inspiration>({
        _id: new ObjectId(),
        meta_title: "",
        meta_description: "",
        canonical: "",
        slug: "",
        image: "",
        dob: new Date().toISOString(),
        dod: new Date().toISOString(),
        name: "",
        designation: "",
        content: "",
    });
    const router = useRouter();
    const editorRef = useRef<any>(null);
    const [snackbar, setSnackbar] = React.useState<Pick<
        AlertProps,
        "children" | "severity"
    > | null>(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAlive, setIsAlive] = useState(false);
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
    const handleEditorChange = (a: any, editor: any) => {
        setRow((prevRow) => ({ ...prevRow, content: a }));
    };
    const imageUploader = (blobInfo: any, progress: any) =>
        new Promise<string>((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", blobInfo.blob(), blobInfo.filename());

            fetch(`/api/upload`, {
                method: "POST",
                body: formData,
            })
                .then((response) => {
                    if (!response.ok) {
                        if (response.status === 403) {
                            reject({
                                message: "HTTP Error: " + response.status,
                                remove: true,
                            });
                        } else {
                            reject("HTTP Error: " + response.status);
                        }
                        return;
                    }
                    return response.json();
                })
                .then((json) => {
                    if (json && typeof json.location === "string") {
                        resolve(json.location);
                    } else {
                        reject("Invalid JSON: " + JSON.stringify(json));
                    }
                })
                .catch((error) => {
                    reject("Image upload failed. Error: " + error.message);
                });
        });
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

    const filePickerCallback = (callback: any, value: any, meta: any) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "audio/*,video/*");

        input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
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
                    .then((json) => {
                        if (json && typeof json.location === "string") {
                            callback(json.location, {
                                text: file.name,
                                title: file.name,
                            });
                        } else {
                            throw new Error(
                                "Invalid JSON: " + JSON.stringify(json)
                            );
                        }
                    })
                    .catch((error) => {
                        console.error(
                            "File upload failed. Error: " + error.message
                        );
                    });
            }
        };

        input.click();
    };
    const handleSubmit = async () => {
        setIsLoaded(false);
        setRow((prevRow) => ({
            ...prevRow,
            content: editorRef.current.getContent(),
        }));
        try {
            validateForm();
            if (fileState && fileState.type.startsWith("image/")) {
                await uploadImage(fileState);
            }
            if (isAlive) {
                delete row.dod;
            }
            await setData(row);
            setIsLoaded(true);
            setSnackbar({
                children: "Inspiration successfully Saved.",
                severity: "success",
            });
            setTimeout(() => {
                router.back();
            }, 3000);
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
            if (params.edit !== "new") {
                const data = await getData(params.edit);
                setRow(data);
            }
            setIsLoaded(true);
        };
        populateForm();
    }, []);
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                    <BaseCard title="Edit Inspiration">
                        {isLoaded ? (
                            <>
                                <Stack spacing={3}>
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
                                    <TextField
                                        label="Meta Title"
                                        variant="outlined"
                                        id="meta_title"
                                        value={row?.meta_title}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Meta Description"
                                        multiline
                                        rows={4}
                                        id="meta_description"
                                        value={row?.meta_description}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Canonical Link"
                                        variant="outlined"
                                        id="canonical"
                                        value={row?.canonical}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Slug"
                                        variant="outlined"
                                        id="slug"
                                        value={row?.slug}
                                        onChange={handleChange}
                                    />

                                    <Stack
                                        direction={"row"}
                                        spacing={2}
                                        alignItems={"center"}
                                    >
                                        <FormLabel>Featured Image:</FormLabel>
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
                                    <Stack
                                        direction={"row"}
                                        spacing={2}
                                        alignItems={"center"}
                                    >
                                        <FormLabel>Date of Birth:</FormLabel>
                                        <input
                                            type="date"
                                            name="dob"
                                            id="dob"
                                            defaultValue={row?.dob.slice(0, 10)}
                                            onChange={handleChange}
                                            style={{
                                                border: "1px solid #bdbdbd",
                                                borderRadius: "4px",
                                                padding: "8px 12px",
                                                fontSize: "16px",
                                                outlineColor: "#03c9d7",
                                                backgroundColor: "#fafafa",
                                                width: "150px",
                                                boxShadow:
                                                    "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                        />
                                    </Stack>
                                    <Stack
                                        direction={"row"}
                                        spacing={2}
                                        alignItems={"center"}
                                    >
                                        <FormLabel>Date of Death:</FormLabel>
                                        <input
                                            type="date"
                                            name="dod"
                                            id="dod"
                                            disabled={isAlive}
                                            defaultValue={row?.dod?.slice(
                                                0,
                                                10
                                            )}
                                            onChange={handleChange}
                                            style={{
                                                border: "1px solid #bdbdbd",
                                                borderRadius: "4px",
                                                padding: "8px 12px",
                                                fontSize: "16px",
                                                outlineColor: "#03c9d7",
                                                backgroundColor: "#fafafa",
                                                width: "150px",
                                                boxShadow:
                                                    "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={() =>
                                                        setIsAlive(!isAlive)
                                                    }
                                                />
                                            }
                                            label="Alive"
                                        />
                                    </Stack>
                                    <Editor
                                        id="content"
                                        apiKey="c9gbqgvdzp4v1bzls5udybk9dj7n4c4zsh4wws6j5or5s3uy"
                                        init={{
                                            plugins:
                                                "anchor autolink charmap codesample emoticons image link lists media searchreplace visualblocks wordcount",
                                            toolbar:
                                                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                                            placeholder: "Type here...",
                                            images_upload_handler:
                                                imageUploader,
                                            automatic_uploads: true,
                                            file_picker_callback:
                                                filePickerCallback,
                                            file_picker_types: "media",
                                        }}
                                        onInit={(evt, editor) =>
                                            (editorRef.current = editor)
                                        }
                                        value={row?.content}
                                        onEditorChange={handleEditorChange}
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
