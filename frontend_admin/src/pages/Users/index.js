import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUsers } from "../../redux/users/usersSlice";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  LinearProgress,
  Link,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const Membership = ({ membership }) => {
  let starts_date = new Date(membership.issuedDate);
  let expires_date = new Date(membership.dueDate);

  let year = starts_date.getFullYear();
  let month = starts_date.getMonth() + 1;
  let day = starts_date.getDate();
  let starts_on = year + "-" + month + "-" + day;

  year = expires_date.getFullYear();
  month = expires_date.getMonth() + 1;
  day = expires_date.getDate();
  let expires_on = year + "-" + month + "-" + day;

  let totalSeconds = expires_date - starts_date;
  let availableSeconds = expires_date - new Date();
  let progress = (availableSeconds / totalSeconds) * 100;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color={"gray"} fontSize={12}>
          <strong>{starts_on}</strong>{" "}
        </Typography>
        <Typography variant="body2" fontSize={12}>
          <strong>{expires_on}</strong>
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
};

export default function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((store) => store.users.data);

  const columns = [
    {
      headerName: " User",
      flex: 0.6,
      width: 240,
      renderCell: (params) => {
        return (
          <Link href={`/users/view/${params.row._id}`} underline="none">
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Avatar alt={params.row.userName} />
              <Box>
                <Typography variant="body2" fontSize={14}>
                  {params.row.userName}
                </Typography>
                <Typography variant="body2" fontSize={14}>
                  {params.row.email}
                </Typography>
              </Box>
            </Box>
          </Link>
        );
      },
    },
    { field: "role", headerName: "Role", width: 160 },
    { field: "deviceInfo", headerName: "Device", width: 240, flex: 1 },
    {
      field: "memberships",
      headerName: "Memebership",
      width: 300,
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {params.value.map((m) => (
              <Membership membership={m} />
            ))}
          </Box>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              gap: 0.2,
            }}
          >
            <IconButton
              onClick={() => {
                navigate(`/users/view/${params.row._id}`);
              }}
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                dispatch(deleteUser(params.row._id));
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <Card>
      <CardHeader title="Users" />
      <CardContent>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => `#${row._id.toString()}`}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          getRowHeight={(params) => 60 * params.model.memberships.length}
          pageSizeOptions={[5, 10]}
          //   checkboxSelection
        />
      </CardContent>
    </Card>
  );
}
