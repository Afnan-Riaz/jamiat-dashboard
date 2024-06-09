"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridCellEditStopReasons,
} from "@mui/x-data-grid";
import Loading from "@/app/loading";
import { Alert, AlertProps, Snackbar } from "@mui/material";
import BaseCard from "@/app/(DashboardLayout)/components/shared/BaseCard";

const getData = async () => {
    const data = await fetch(`/api/analytics`).then((response) =>
        response.json()
    );
    return data;
};
const setData = async (data: GridRowModel) => {
    const result = await fetch(`/api/analytics`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
    if (result.success) return result;
    throw new Error("Error while saving data");
};

function isKeyboardEvent(event: any): event is React.KeyboardEvent {
    return !!event.key;
}

export default function Analytics() {
    const [rows, setRows] = React.useState<GridRowsProp>([]);
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
            const initialRows: GridRowsProp = await getData();
            setRows(initialRows);
            setDataFetched(true);
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
        console.log(newRow);
        await setData(newRow);
        setSnackbar({
            children: "Data successfully saved.",
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
        { field: "title", headerName: "Title", width: 200, editable: true },
        {
            field: "count",
            headerName: "Count",
            type: "number",
            width: 100,
            headerAlign: "left",
            align: "left",
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
                ];
            },
        },
    ];
    return (
        <BaseCard title="Edit Analytics">
            <Box
                sx={{
                    height: 400,
                    width: "100%",
                    "& .actions": {
                        color: "text.secondary",
                    },
                    "& .textPrimary": {
                        color: "text.primary",
                    },
                }}
            >
                {dataFetched ? (
                    <>
                        <DataGrid
                            sx={{
                                "& .MuiDataGrid-columnHeaderTitle": {
                                    fontWeight: "600",
                                },
                            }}
                            rows={rows}
                            columns={columns}
                            editMode="row"
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
                            onProcessRowUpdateError={
                                handleProcessRowUpdateError
                            }
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
        </BaseCard>
    );
}
