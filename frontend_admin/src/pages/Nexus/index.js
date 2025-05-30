import React, { useCallback, useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  TablePagination,
} from "@mui/material";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, setParams } from "../../redux/nexus/nexusSlice";
import ProductDetails from "./ProductDetails";
import { useLocation } from "react-router-dom";

export default function Nexus() {
  const { params, products, total, loading } = useSelector(
    (state) => state.nexus
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const [product, setProduct] = useState();
  const [showProductResearch, setShowProductResearch] = useState(false);

  const fetchProducts = useCallback(() => {
    dispatch(getProducts(params));
  }, [dispatch, params]);

  useEffect(() => {
    if (location.pathname.includes("nexus-all")) {
      dispatch(setParams({ page: 0, field: "nexus" }));
    } else if (location.pathname.includes("nexus-trending")) {
      dispatch(setParams({ page: 0, field: "trend" }));
    } else if (location.pathname.includes("nexus-rise")) {
      dispatch(setParams({ page: 0, field: "rise" }));
    } else if (location.pathname.includes("nexus-hot")) {
      dispatch(setParams({ page: 0, field: "hot" }));
    } else if (location.pathname.includes("nexus-new")) {
      dispatch(setParams({ page: 0, field: "new" }));
    }
  }, [dispatch, location.pathname]);

  useEffect(() => {
    fetchProducts();
  }, [params, dispatch, fetchProducts]);

  const handleChangePage = (event, newPage) => {
    dispatch(setParams({ ...params, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setParams({ ...params, page: 0, page_size: event.target.value }));
  };

  const handleResearch = (product) => {
    setProduct(product);
    setShowProductResearch(true);
  };

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
      <SearchBar />
      <Box>
        <Button
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress size={90} />
      </Backdrop>
      {products.length === 0 ? (
        <Box
          sx={{
            mt: 6,
          }}
        >
          <Typography variant="h5" textAlign={"center"}>
            No results found
          </Typography>
        </Box>
      ) : (
        <>
          <TablePagination
            component="div"
            count={total}
            page={params?.page}
            onPageChange={handleChangePage}
            rowsPerPage={params?.page_size}
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
