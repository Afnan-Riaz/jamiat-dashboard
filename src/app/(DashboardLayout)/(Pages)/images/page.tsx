"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import mongoose from "mongoose";
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
import Loading from "@/app/loading";
import {
    Alert,
    AlertProps,
    InputBase,
    InputBaseProps,
    Paper,
    Popper,
    Snackbar,
    styled,
} from "@mui/material";
import Image from "next/image";
import { IconUpload } from "@tabler/icons-react";
import BaseCard from "../../components/shared/BaseCard";

const ObjectId = mongoose.Types.ObjectId;

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
    const data = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/media/images`
    ).then((response) => response.json());
    return data;
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
const setData = async (data: GridRowModel) => {
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/media/images`,
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
const deleteData = async (data: object) => {
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
                title: "",
                description: "",
                link: "",
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [_id.toString()]: {
                mode: GridRowModes.Edit,
                fieldToFocus: "title",
            },
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

function isKeyboardEvent(event: any): event is React.KeyboardEvent {
    return !!event.key;
}

function EditTextarea(props: GridRenderEditCellParams<any, string>) {
    const { id, field, value, colDef, hasFocus } = props;
    const [valueState, setValueState] = React.useState(value);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>();
    const [inputRef, setInputRef] = React.useState<HTMLInputElement | null>(
        null
    );
    const apiRef = useGridApiContext();

    React.useLayoutEffect(() => {
        if (hasFocus && inputRef) {
            inputRef.focus();
        }
    }, [hasFocus, inputRef]);

    const handleRef = React.useCallback((el: HTMLElement | null) => {
        setAnchorEl(el);
    }, []);

    const handleChange = React.useCallback<
        NonNullable<InputBaseProps["onChange"]>
    >(
        (event) => {
            const newValue = event.target.value;
            setValueState(newValue);
            apiRef.current.setEditCellValue(
                { id, field, value: newValue, debounceMs: 200 },
                event
            );
        },
        [apiRef, field, id]
    );

    return (
        <div style={{ position: "relative", alignSelf: "flex-start" }}>
            <div
                ref={handleRef}
                style={{
                    height: 1,
                    width: colDef.computedWidth,
                    display: "block",
                    position: "absolute",
                    top: 0,
                }}
            />
            {anchorEl && (
                <Popper
                    open
                    anchorEl={anchorEl}
                    placement="bottom-start"
                    style={{ zIndex: "20" }}
                >
                    <Paper
                        elevation={1}
                        sx={{ p: 1, minWidth: colDef.computedWidth }}
                    >
                        <InputBase
                            multiline
                            rows={4}
                            value={valueState}
                            sx={{ textarea: { resize: "both" }, width: "100%" }}
                            onChange={handleChange}
                            inputRef={(ref) => setInputRef(ref)}
                        />
                    </Paper>
                </Popper>
            )}
        </div>
    );
}

const multilineColumn: GridColTypeDef = {
    type: "string",
    renderEditCell: (params) => <EditTextarea {...params} />,
};

export default function Images() {
    const [rows, setRows] = React.useState<GridRowsProp>([]);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
        {}
    );
    const [dataFetched, setDataFetched] = React.useState<boolean>(false);
    const [snackbar, setSnackbar] = React.useState<Pick<
        AlertProps,
        "children" | "severity"
    > | null>(null);
    const [fileState, setFileState] = React.useState<File | undefined>();
    const handleCloseSnackbar = () => setSnackbar(null);
    React.useEffect(() => {
        async function getRows() {
            const initialRows: GridRowsProp = await getData();
            setRows(initialRows);
            setDataFetched(true);
        }
        getRows();
    }, []);
    const handleFileChange = (
        id: GridRowId,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target?.files;
        if (files && files.length > 0) {
            setFileState(files[0]);
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
            await deleteData({ _id: id });
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
        setFileState(undefined);
        const editedRow = rows.find((row) => row._id.toString() === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row._id.toString() !== id));
        }
    };

    const processRowUpdate = async (newRow: GridRowModel) => {
        if (fileState && fileState.type.startsWith("image/")) {
            newRow.link = "/" + fileState?.name;
            await uploadImage(fileState);
        }
        const updatedRow = { ...newRow, isNew: false };
        setRows(
            rows.map((row) =>
                row._id.toString() === newRow._id ? updatedRow : row
            )
        );
        await setData(newRow);
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
    const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
        return {
            top: params.isFirstVisible ? 0 : 5,
            bottom: params.isLastVisible ? 0 : 5,
        };
    }, []);
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
                    sx={{
                        justifyContent: "start",
                        width: "100%",
                        paddingInline: "6px",
                        marginInline: "4px",
                        overflowX: "hidden",
                    }}
                    startIcon={<IconUpload />}
                >
                    {fileState ? fileState.name : "Upload Image"}
                    <HiddenInput
                        type="file"
                        onChange={(e) => handleFileChange(params.id, e)}
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
                        objectPosition: "left",
                    }}
                    width={100}
                    height={60}
                />
            ),
        },
        { field: "title", headerName: "Title", width: 180, editable: true },
        {
            field: "description",
            headerName: "Description",
            type: "string",
            width: 400,
            editable: true,
            ...multilineColumn,
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
    return (
        <Box
            sx={{
                height: 500,
                width: "100%",
                "& .actions": {
                    color: "text.secondary",
                },
                "& .textPrimary": {
                    color: "text.primary",
                },
            }}
        >
            <BaseCard title="Manage Images">
            {dataFetched ? (
                <>
                    <DataGrid
                        sx={{
                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: "600",
                            },
                            height: "70vh",
                        }}
                        rows={rows}
                        columns={columns}
                        editMode="row"
                        rowHeight={100}
                        getRowSpacing={getRowSpacing}
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        onCellEditStop={(params, event) => {
                            if (
                                params.reason !==
                                GridCellEditStopReasons.enterKeyDown
                            ) {
                                return;
                            }
                            if (
                                isKeyboardEvent(event) &&
                                !event.ctrlKey &&
                                !event.metaKey
                            ) {
                                event.defaultMuiPrevented = true;
                            }
                        }}
                        processRowUpdate={processRowUpdate}
                        onProcessRowUpdateError={handleProcessRowUpdateError}
                        slots={{
                            toolbar: EditToolbar,
                        }}
                        slotProps={{
                            toolbar: { setRows, setRowModesModel },
                        }}
                        getRowId={(row) => row._id.toString()}
                    />
                    {!!snackbar && (
                        <Snackbar
                            open
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            onClose={handleCloseSnackbar}
                            autoHideDuration={6000}
                        >
                            <Alert
                                {...snackbar}
                                onClose={handleCloseSnackbar}
                            />
                        </Snackbar>
                    )}
                </>
            ) : (
                <Loading />
            )}</BaseCard>
        </Box>
    );
}
