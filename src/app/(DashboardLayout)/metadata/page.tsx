"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
    GridRowsProp,
    GridRowModesModel,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowId,
} from "@mui/x-data-grid";
import Loading from "../loading";
import { Alert, AlertProps, CircularProgress, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";

const getData = async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api`).then(
        (response) => response.json()
    );
    return data;
};

const deleteData = async (data: object) => {
    const result = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
    if (result.success) return result;
    throw new Error("Error while deleting data");
};

function EditToolbar() {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/metadata/new`);
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

export default function Metadata() {
    const [rows, setRows] = React.useState<GridRowsProp>([]);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
        {}
    );
    const router = useRouter();
    const [dataFetched, setDataFetched] = React.useState<boolean>(false);
    const [isLoading, setLoading] = React.useState<GridRowId | null>(null);
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

    const handleEditClick = (id: GridRowId) => () => {
        router.push(`/metadata/${id}`);
    };

    const handleDeleteClick = (id: GridRowId) => async () => {
        try {
            setLoading(id);
            await deleteData({ _id: id });
            setLoading(null);
            setSnackbar({
                children: "Page successfully Deleted.",
                severity: "success",
            });
            setRows(rows.filter((row) => row._id.toString() !== id));
        } catch (error) {
            setLoading(null);
            setSnackbar({
                children: "Could not delete data.",
                severity: "error",
            });
        }
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const columns: GridColDef[] = [
        {
            field: "page_title",
            headerName: "Page Title",
            width: 150,
            editable: false,
        },
        {
            field: "meta_title",
            headerName: "Meta Title",
            type: "string",
            width: 150,
            editable: false,
        },
        {
            field: "meta_description",
            headerName: "Meta Description",
            type: "string",
            width: 180,
            editable: false,
        },
        {
            field: "canonical",
            headerName: "Canonical Link",
            type: "string",
            width: 180,
            editable: false,
        },
        {
            field: "slug",
            headerName: "Slug",
            type: "string",
            width: 150,
            editable: false,
        },
        {
            field: "content",
            headerName: "Content",
            type: "string",
            width: 200,
            editable: false,
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => {
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
                        icon={
                            isLoading == id ? (
                                <CircularProgress size={30} />
                            ) : (
                                <DeleteIcon />
                            )
                        }
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
            {dataFetched ? (
                <>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
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
                            autoHideDuration={1000}
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
