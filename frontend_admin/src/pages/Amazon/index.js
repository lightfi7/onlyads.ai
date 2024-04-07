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
import { getProducts, setParams } from "../../redux/amazon/amazonSlice";
import TrendChat from "./TrendChat";

export default function Amazon() {
  const { params, products, total, loading } = useSelector(
    (state) => state.amazon
  );
  const dispatch = useDispatch();
  const [product, setProduct] = useState();
  const [showTrendChart, setShowTrendChart] = useState(false);

  const fetchProducts = useCallback(() => {
    dispatch(getProducts(params));
  }, [dispatch, params]);

  useEffect(() => {
    fetchProducts();
  }, [params, dispatch, fetchProducts]);

  const handleChangePage = (event, newPage) => {
    dispatch(setParams({ ...params, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setParams({ ...params, page: 0, page_size: event.target.value }));
  };

  const handleTrendChart = (product) => {
    setProduct(product);
    setShowTrendChart(true);
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
                categories: [],
                price: {
                  min: null,
                  max: null,
                },
                rank: "any",
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
                <ProductCard
                  data={product}
                  handleTrendChart={handleTrendChart}
                />
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
          {product && showTrendChart && (
            <TrendChat
              open={showTrendChart}
              onClose={() => setShowTrendChart(false)}
              product={product}
            />
          )}
        </>
      )}
    </Box>
  );
}
