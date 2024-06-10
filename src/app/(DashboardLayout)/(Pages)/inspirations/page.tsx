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
    GridRowSpacingParams,
} from "@mui/x-data-grid";
import Loading from "@/app/loading";
import { Alert, AlertProps, CircularProgress, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BaseCard from "../../components/shared/BaseCard";

const getData = async () => {
    const data = await fetch(`/api/profiles/inspirations`).then((response) =>
        response.json()
    );
    return data;
};

const deleteData = async (data: object) => {
    const result = await fetch(`/api/profiles/inspirations`, {
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
        router.push(`/inspirations/new`);
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

export default function Inspirations() {
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
        router.push(`/inspirations/${id}`);
    };

    const handleDeleteClick = (id: GridRowId) => async () => {
        try {
            setLoading(id);
            await deleteData({ _id: id });
            setLoading(null);
            setSnackbar({
                children: "Inspiration successfully Deleted.",
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
    const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
        return {
            top: params.isFirstVisible ? 0 : 5,
            bottom: params.isLastVisible ? 0 : 5,
        };
    }, []);
    const columns: GridColDef[] = [
        {
            field: "image",
            headerName: "Photo",
            width: 90,
            editable: false,
            renderCell: (params) => (
                <Image
                    src={`${process.env.NEXT_PUBLIC_CDN_PATH}/images${params.value}`}
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
        {
            field: "name",
            headerName: "Name",
            width: 180,
            editable: false,
        },
        {
            field: "designation",
            headerName: "Designation",
            width: 160,
            editable: false,
        },
        {
            field: "slug",
            headerName: "Slug",
            type: "string",
            width: 120,
            editable: false,
        },
        {
            field: "content",
            headerName: "Content",
            type: "string",
            width: 180,
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
            <BaseCard title="Manage Inspirations">
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
                            getRowSpacing={getRowSpacing}
                            rowHeight={80}
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
            </BaseCard>
        </Box>
    );
}
