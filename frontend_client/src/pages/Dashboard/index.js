import React, { useEffect } from "react";
import SearchBar from "./SearchBar";
import {
  Alert,
  AlertTitle,
  Box,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import AdPreview from "./AdPreview";
import AdCard from "./AdCard";
import { useDispatch, useSelector } from "react-redux";
import { getAds, loadParams, setParams } from "../../redux/dashboard/dataSlice";
import { useAuth } from "../../hooks/useAuth";
import CloseIcon from "@mui/icons-material/Close";

export default function Dashboard() {
  const [previewOpen, setPrivewOpen] = React.useState(false);
  const [previewData, setPreviewData] = React.useState(null);

  const { user, isLoading } = useAuth();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);

  const userStatus = !user?.expired;

  useEffect(() => {
    dispatch(loadParams());
  }, [dispatch]);

  useEffect(() => {
    if (data.inited) dispatch(getAds(data.params));
  }, [data.params, data.inited, dispatch]);

  const handlePreview = (data) => {
    setPreviewData(data);
    setPrivewOpen(true);
  };

  const handlePageChange = (event, page) => {
    if (!userStatus) return;
    if (data.params.page !== page)
      dispatch(setParams({ ...data.params, page: page }));
  };
  const handleSortBy = (event) => {
    dispatch(setParams({ ...data.params, sortBy: event.target.value }));
  };

  if (isLoading) return <></>

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        p: {
          xs: 0,
          sm: 4,
        },
      }}
    >
      {!userStatus && (
        <Box
          sx={{
            mb: 4,
          }}
        >
          <Alert severity="info">
            <AlertTitle>
              Upgrade your membership to access this feature
            </AlertTitle>
            To utilize this feature, we recommend upgrading your membership. You
            can upgrade your membership <a href="/pricing">here</a>.
          </Alert>
        </Box>
      )}

      <SearchBar data={data} userStatus={userStatus} />

      <Divider
        sx={{
          my: 4,
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          my: 4,
        }}
      >
        <Select size="small" value={data.params.sortBy} onChange={handleSortBy}>
          <MenuItem value={"asc"}>Sort by: First seen</MenuItem>
          <MenuItem value={"desc"}>Sort by: Last seen</MenuItem>
        </Select>
      </Box>
      <Grid container spacing={4}>
        {data.ads.map((ad, key) => (
          <Grid key={key} item xs={12} sm={6} md={4} lg={3}>
            <AdCard handleClick={handlePreview} data={ad} />
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          my: 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          disabled={!userStatus}
          count={Math.ceil(data.total / 12)}
          size="large"
          showFirstButton
          showLastButton
          onChange={handlePageChange}
        />
      </Box>

      <Dialog
        open={previewOpen}
        fullWidth
        maxWidth={"xl"}
        onClose={() => setPrivewOpen(false)}
      >
        <IconButton
          aria-label="close"
          onClick={() => {
            setPrivewOpen(false)
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          sx={{
            pt: 2,
            px: 4,
          }}
        >
          <AdPreview data={previewData} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
