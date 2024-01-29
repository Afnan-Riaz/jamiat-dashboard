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
} from "@mui/material";
import BaseCard from "@/app/(DashboardLayout)/components/shared/BaseCard";
import mongoose from "mongoose";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

interface Page {
    _id: object;
    meta_title: string;
    meta_description: string;
    canonical: string;
    slug: string;
    page_title: string;
    content?: string;
}

const getData = async (id: string) => {
    const data = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/${id}`
    ).then((response) => response.json());
    return data;
};

const setData = async (data: Page) => {
    const result = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api`, {
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
    const [row, setRow] = useState<Page>({
        _id: new ObjectId(),
        meta_title: "",
        meta_description: "",
        canonical: "",
        slug: "",
        page_title: "",
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
    const validateForm=()=>{
        if(row._id&&row.page_title!=""&&row.meta_title!=""&&row.meta_description!=""&&row.canonical!=""&&row.slug!="")
            return true;
        throw new Error();
    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setRow((prevRow) => ({ ...prevRow, [id]: value }));
    };
    const handleEditorChange = (a: any, editor: any) => {
        setRow((prevRow) => ({ ...prevRow, content: a }));
    };
    const handleSubmit = async () => {
        setIsLoaded(false);
        setRow((prevRow) => ({
            ...prevRow,
            content: editorRef.current.getContent(),
        }));
        try {
            validateForm();
            await setData(row);
            setIsLoaded(true);
            setSnackbar({
                children: "Page successfully Saved.",
                severity: "success",
            });
            setTimeout(() => {
                router.push("/metadata");
            }, 3000);
        } catch (error) {
            setIsLoaded(true);

            setSnackbar({
                children: "An error occured.",
                severity: "error",
            });
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
                    <BaseCard title="Edit Page">
                        {isLoaded ? (
                            <>
                                <Stack spacing={3}>
                                    <TextField
                                        label="Page Title"
                                        variant="outlined"
                                        id="page_title"
                                        value={row?.page_title}
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
                                    <Editor
                                        id="content"
                                        apiKey="c9gbqgvdzp4v1bzls5udybk9dj7n4c4zsh4wws6j5or5s3uy"
                                        init={{
                                            plugins:
                                                "tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss",
                                            toolbar:
                                                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                                            tinycomments_mode: "embedded",
                                            tinycomments_author: "Jamiat",
                                            placeholder: "Type here...",
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
                                    <Button variant="outlined">Cancel</Button>
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
