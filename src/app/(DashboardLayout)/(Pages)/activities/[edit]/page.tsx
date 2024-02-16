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
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    useGridApiContext,
    GridRenderEditCellParams,
    GridColTypeDef,
    GridCellEditStopReasons,
    GridRowSpacingParams,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import mongoose from "mongoose";
import BaseCard from "@/app/(DashboardLayout)/components/shared/BaseCard";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { IconUpload } from "@tabler/icons-react";
import Image from "next/image";

interface Activity {
    _id: object;
    meta_title?: string;
    meta_description?: string;
    title: string;
    canonical?: string;
    slug?: string;
    image: string;
    content: string;
    date: string;
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
    const data = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/blogs/${id}`
    ).then((response) => response.json());
    return data;
};
const getImages = async (id:string) => {
    const data = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/media/images/${id}`
    ).then((response) => response.json());
    return data;
};
const setImages = async (data: GridRowModel,id:string) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/media/images/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    ).then((response) => response.json());
    if (result.success) return result;
    throw new Error("Error while saving data");
};
const deleteImage = async (data: object) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/media/images`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    ).then((response) => response.json());
    if (result.success) return result;
    throw new Error("Error while deleting data");
};
const setData = async (data: Activity) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/blogs/activities`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    ).then((response) => response.json());
    if (result.success) return result;
    throw new Error("Error while saving data");
};
const ObjectId = mongoose.Types.ObjectId;
interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const _id = new ObjectId();
        setRows((oldRows) => [
            ...oldRows,
            {
                _id,
                title:"",
                description:"",
                link:"",
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [_id.toString()]: { mode: GridRowModes.Edit, fieldToFocus: "title" },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClick}
            >
                Add record
            </Button>
        </GridToolbarContainer>
    );
}

export default function Edit({ params }: any) {
    const [fields, setFields] = useState<Activity>({
        _id: new ObjectId(),
        meta_title: "",
        meta_description: "",
        canonical: "",
        slug: "",
        image: "",
        date: new Date().toISOString(),
        title: "",
        content: "",
    });
    const router = useRouter();
    const editorRef = useRef<any>(null);

    const [rows, setRows] = React.useState<GridRowsProp>([]);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
        {}
    );
    const [dataFetched, setDataFetched] = React.useState<boolean>(false);
    const [imageState, setImageState] = React.useState<File | undefined>();
    const [snackbar, setSnackbar] = React.useState<Pick<
        AlertProps,
        "children" | "severity"
    > | null>(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [fileState, setFileState] = React.useState<File | undefined>();
    const handleImageChange = (
        id: GridRowId,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target?.files;
        if (files && files.length > 0) {
            setImageState(files[0]);
        }
    };
    const handleRowEditStop: GridEventListener<"rowEditStop"> = (
        params,
        event
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.Edit },
        });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View },
        });
    };

    const handleDeleteClick = (id: GridRowId) => async () => {
        try {
            await deleteImage({ _id: id });
            setSnackbar({
                children: "Image successfully Deleted.",
                severity: "success",
            });
            setRows(rows.filter((row) => row._id.toString() !== id));
        } catch (error) {
            setSnackbar({
                children: "Could not delete data.",
                severity: "error",
            });
        }
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
        setImageState(undefined)
        const editedRow = rows.find((row) => row._id.toString() === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row._id.toString() !== id));
        }
    };
    const processRowUpdate = async (newRow: GridRowModel) => {
        if (imageState && imageState.type.startsWith("image/")) {
            newRow.link = "/"+imageState?.name;
            await uploadImage(imageState);
        }
        const updatedRow = { ...newRow, isNew: false };
        setRows(
            rows.map((row) =>
                row._id.toString() === newRow._id ? updatedRow : row
            )
        );
        await setImages(newRow,fields._id.toString());
        setSnackbar({
            children: "Image successfully saved.",
            severity: "success",
        });
        return updatedRow;
    };

    const handleProcessRowUpdateError = React.useCallback((error: Error) => {
        setSnackbar({
            children: "Invalid Data! Please retry.",
            severity: "error",
        });
    }, []);

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const columns: GridColDef[] = [
        {
            field: "link",
            headerName: "Image",
            type: "string",
            width: 150,
            editable: true,
            renderEditCell: (params) => (
                <Button
                    component="label"
                    variant="contained"
                    sx={{justifyContent:"start",width:"100%", paddingInline:"6px", marginInline:"4px",overflowX:"hidden"}}
                    startIcon={<IconUpload />}
                >
                    {imageState ? imageState.name : "Upload Image"}
                    <HiddenInput
                        type="file"
                        onChange={(e) => handleImageChange(params.id, e)}
                        multiple={false}
                        accept="image/*"
                    />
                </Button>
            ),
            renderCell: (params) => (
                <Image
                    src={`/images${params.value}`}
                    alt="Image"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition:"left"
                    }}
                    width={100}
                    height={60}
                />
            ),
        },
        {
            field: "description",
            headerName: "Description",
            type: "string",
            width: 400,
            editable: true,
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode =
                    rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            key={0}
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            key={1}
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        key={0}
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={1}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];
    const validateForm = () => {
        if (fields._id && fields.title != "" && fields.image != "" && fields.content != "")
            return true;
        throw new Error();
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFields((prevRow) => ({ ...prevRow, [id]: value }));
    };
    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/upload`, {
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
    const handleSubmit = async () => {
        setIsLoaded(false);
        try {
            validateForm();
            if (fileState && fileState.type.startsWith("image/")) {
                await uploadImage(fileState);
            }
            await setData(fields);
            setIsLoaded(true);
            setSnackbar({
                children: "Page successfully Saved.",
                severity: "success",
            });
            setTimeout(() => {
                router.push("/blogs");
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
            fields.image = "/" + files[0].name;
        }
    };
    useEffect(() => {
        const populateForm = async () => {
            if (params.edit !== "new") {
                const data = await getData(params.edit);
                setFields(data);
                const initialRows: GridRowsProp = await getImages(params.edit);
                setRows(initialRows);
                setDataFetched(true);
            }
            setIsLoaded(true);
        };
        populateForm();
    }, []);

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                    <BaseCard title="Edit Activity">
                        {isLoaded ? (
                            <>
                                <Stack spacing={3}>
                                    <TextField
                                        label="Activity Title"
                                        variant="outlined"
                                        id="title"
                                        value={fields?.title}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Activity Description"
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                        id="content"
                                        value={fields?.content}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Meta Title"
                                        variant="outlined"
                                        id="meta_title"
                                        value={fields?.meta_title}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Meta Description"
                                        multiline
                                        rows={4}
                                        id="meta_description"
                                        value={fields?.meta_description}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Canonical Link"
                                        variant="outlined"
                                        id="canonical"
                                        value={fields?.canonical}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Slug"
                                        variant="outlined"
                                        id="slug"
                                        value={fields?.slug}
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
                                            {fields?.image
                                                ? fields.image
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
                                        <FormLabel>Date:</FormLabel>
                                        <input
                                            type="date"
                                            name="date"
                                            id="date"
                                            defaultValue={fields?.date.slice(
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
                                    </Stack>
                                    <DataGrid
                                        sx={{ overflowX: "scroll" }}
                                        rows={rows}
                                        columns={columns}
                                        editMode="row"
                                        rowHeight={80}
                                        rowModesModel={rowModesModel}
                                        onRowModesModelChange={
                                            handleRowModesModelChange
                                        }
                                        columnBuffer={2}
                                        columnThreshold={2}
                                        slots={{
                                            toolbar: EditToolbar,
                                        }}
                                        slotProps={{
                                            toolbar: {
                                                setRows,
                                                setRowModesModel,
                                            },
                                        }}
                                        getRowId={(row) => row._id.toString()}
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
