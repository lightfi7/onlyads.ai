import React, { useEffect, useState, useCallback } from "react";
import {
  Backdrop,
  Alert,
  AlertTitle,
  CircularProgress,
  Typography,
  Box,
  Button,
  Grid,
  TablePagination,
} from "@mui/material";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  getProducts,
  loadParams,
  setParams,
} from "../../redux/nexus/nexusSlice";
import ProductDetails from "./ProductDetails";
import { useAuth } from "../../hooks/useAuth";

export default function Nexus() {
  const { params, products, inited, total, loading } = useSelector(
    (state) => state.nexus
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const [product, setProduct] = useState();
  const [showProductResearch, setShowProductResearch] = useState(false);
  const { user, isLoading } = useAuth();
  const userStatus = !user?.expired;
  const [params_, setParams_] = React.useState({
    field: "nexus",
    page: 1,
  });

  // const handleScroll = useCallback(() => {
  //   const { scrollHeight, clientHeight, scrollTop } = document.documentElement;
  //   if (scrollHeight - scrollTop < clientHeight + 10) {
  //     if (params_.page * 32 < total && !loading)
  //       setParams_((prev) => ({ ...prev, page: params_.page + 1 }));
  //   }
  // }, [params_, total, loading]);

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [handleScroll]);

  useEffect(() => {
    dispatch(loadParams());
  }, [dispatch]);

  useEffect(() => {
    if (inited)
      if (location.pathname.includes("nexus-all")) {
        setParams_({ page: 0, field: "nexus" });
      } else if (location.pathname.includes("nexus-trending")) {
        setParams_({ page: 0, field: "trend" });
      } else if (location.pathname.includes("nexus-rise")) {
        setParams_({ page: 0, field: "rise" });
      } else if (location.pathname.includes("nexus-hot")) {
        setParams_({ page: 0, field: "hot" });
      } else if (location.pathname.includes("nexus-new")) {
        setParams_({ page: 0, field: "new" });
      }
  }, [dispatch, inited, location.pathname]);

  useEffect(() => {
    dispatch(setParams({ ...params, ...params_ }));
  }, [params_]);

  useEffect(() => {
    if (inited) dispatch(getProducts({}));
  }, [params, inited, dispatch]);

  const handleChangePage = (event, newPage) => {
    if (!userStatus) return;
    dispatch(setParams({ ...params, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    if (!userStatus) return;
    dispatch(setParams({ ...params, page: 0, page_size: event.target.value }));
  };

  const handleResearch = (product) => {
    setProduct(product);
    setShowProductResearch(true);
  };

  if (isLoading) return <></>;

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
      <SearchBar disabled={!userStatus} />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress size={90} />
      </Backdrop>
      <Box>
        <Button
          disabled={!userStatus}
          onClick={() => {
            dispatch(
              setParams({
                page: 0,
                page_size: 50,
                q: "",
                ship_from: [],
                categories: [],
                price: {
                  min: null,
                  max: null,
                },
                orders: {
                  min: null,
                  max: null,
                },
                store_selling: {
                  min: null,
                  max: null,
                },
              })
            );
          }}
        >
          Clear All
        </Button>
      </Box>
      {products.length === 0 ? (
        <Box
          sx={{
            mt: 6,
          }}
        >
          <Typography variant="h5" textAlign={"center"}>
            No data found...
          </Typography>
        </Box>
      ) : (
        <>
          <TablePagination
            component="div"
            count={total}
            page={params.page}
            onPageChange={handleChangePage}
            rowsPerPage={params.page_size}
            rowsPerPageOptions={[12, 24, 36, 48]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Grid container spacing={1} sx={{ mt: 2 }}>
            {products.map((product, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <ProductCard data={product} handleResearch={handleResearch} />
              </Grid>
            ))}
          </Grid>
          <TablePagination
            component="div"
            count={total}
            page={params?.page}
            onPageChange={handleChangePage}
            rowsPerPage={params?.page_size}
            rowsPerPageOptions={[12, 24, 36, 48]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          {product && showProductResearch && (
            <ProductDetails
              open={showProductResearch}
              onClose={() => setShowProductResearch(false)}
              product={product}
            />
          )}
        </>
      )}
    </Box>
  );
}
