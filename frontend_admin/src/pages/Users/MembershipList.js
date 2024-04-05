import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { deletePlan, getPlans } from "../../redux/plans/planSlice";

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

export default function MembershipList({ userId }) {
  const dispatch = useDispatch();
  const memberships = useSelector((state) => state.plans.data);

  const columns = [
    { field: "type", headerName: "Membership", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "amount", headerName: "Price", width: 160 },
    {
      field: "state",
      headerName: "State",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        return (
          <Box sx={{ width: "100%" }}>
            <Membership membership={params.row} />
          </Box>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      width: 200,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => {
              dispatch(deletePlan(params.row._id));
            }}
          >
            <DeleteIcon />
          </IconButton>
        );
      },
    },
  ];

  React.useEffect(() => {
    dispatch(getPlans({ id: userId }));
  }, [dispatch, userId]);

  return (
    <Card>
      <CardHeader title="Memberships" />
      <CardContent>
        <DataGrid
          rows={memberships}
          columns={columns}
          getRowId={(row) => `#${row._id.toString()}`}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </CardContent>
    </Card>
  );
}
