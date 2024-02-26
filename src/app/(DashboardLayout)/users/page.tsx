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
} from "@mui/x-data-grid";
import Loading from "../loading";
import { Alert, AlertProps, Snackbar } from "@mui/material";

const ObjectId = mongoose.Types.ObjectId;

const getData = async () => {
    const data = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/users`
    ).then(async (response) => {
        const data = await response.json();
        return { status: response.status, message: data.message };
    });
    return data;
};
const setData = async (data: GridRowModel) => {
    const result = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/users`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
    if (result.success) return result;
    throw new Error("Error while saving data");
};
const deleteData = async (data: object) => {
    const result = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/users`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
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
            { _id, username: "", name: "", password: "", isNew: true },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [_id.toString()]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
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
export default function Users() {
    const [rows, setRows] = React.useState<GridRowsProp>([]);
    const [alert, setAlert] = React.useState();
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
        {}
    );
    const [dataFetched, setDataFetched] = React.useState<boolean>(false);
    const [snackbar, setSnackbar] = React.useState<Pick<
        AlertProps,
        "children" | "severity"
    > | null>(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    React.useEffect(() => {
        async function getRows() {
            const initialRows: any = await getData();
            if (initialRows?.status === 401) {
                setAlert(initialRows.message);
            } else {
                setRows(initialRows.message);
                setDataFetched(true);
            }
        }
        getRows();
    }, []);

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
                children: "User successfully Deleted.",
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

        const editedRow = rows.find((row) => row._id.toString() === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row._id.toString() !== id));
        }
    };

    const processRowUpdate = async (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(
            rows.map((row) =>
                row._id.toString() === newRow._id ? updatedRow : row
            )
        );
        await setData(newRow);
        setSnackbar({
            children: "User successfully saved.",
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
        { field: "name", headerName: "Name", width: 180, editable: true },
        {
            field: "username",
            headerName: "Username",
            type: "string",
            width: 180,
            editable: true,
        },
        {
            field: "password",
            headerName: "Password",
            type: "string",
            width: 180,
            editable: true,
        },
        {
            field: "role",
            headerName: "Role",
            width: 150,
            editable: true,
            type: "singleSelect",
            valueOptions: ["Select One", "Admin", "Editor", "Guest"],
            valueGetter: (params) => params.value || "Select One",
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
            {alert ? (
                <Alert severity="error">{alert}</Alert>
            ) : dataFetched ? (
                <>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        onProcessRowUpdateError={handleProcessRowUpdateError}
                        columnBuffer={2}
                        columnThreshold={2}
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
            )}
        </Box>
    );
}
