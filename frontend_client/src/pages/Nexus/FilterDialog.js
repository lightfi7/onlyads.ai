import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const categories = [
  "Automobiles &amp; Motorcycles",
  "Beauty &amp; Health",
  "Consumer Electronics &amp; Accessories",
  "General Clothing &amp; Accessories",
  "Hobbies &amp; Toys",
  "Home &amp; Garden",
  "Jewelry",
  "Men's Clothing &amp; Accessories",
  "Mother &amp; Kids",
  "Other",
  "Pets Products",
  "Seasonal",
  "Sports &amp; Entertainment",
  "Watches",
  "Women's Clothing &amp; Accessories",
];

const countries = [
  "United States (Fast)",
  "United States (All Methods)",
  "Europe",
  "United Kingdom",
  "Spain",
  "France",
  "Czech Republic",
  "Poland",
  "Australia",
  "Brazil",
  "Germany",
  "Belgium",
  "China",
];

export default function FilterDialog(props) {
  const [params, setParams] = useState({
    price: { min: null, max: null },
    orders: { min: null, max: null },
    store_selling: { min: null, max: null },
    categories: [],
    ship_from: [],
  });

  useEffect(() => {
    setParams({
      price: params?.price,
      orders: params?.orders,
      store_selling: params?.store_selling,
      categories: params?.categories,
      ship_from: params?.ship_from,
    });
  }, [
    params?.categories,
    params?.orders,
    params?.price,
    params?.ship_from,
    params?.store_selling,
    props.params,
  ]);

  return (
    <Dialog
      fullWidth
      maxWidth={"xl"}
      open={props?.open}
      onClose={props?.onClose}
    >
      <DialogContent
        sx={{
          pt: 2,
          px: 4,
        }}
      >
        <Typography variant="h5">More Filters</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={() => {
              props?.setParams({
                ...props?.params,
                price: { min: null, max: null },
                orders: { min: null, max: null },
                store_selling: { min: null, max: null },
                categories: [],
                ship_from: [],
              });
            }}
          >
            Clear All
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            gap: 3,
            p: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Box
              sx={{
                flex: 1,
              }}
            >
              <Typography variant="h6" fontSize={18}>
                Categories
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  gap: 2,
                }}
              >
                <Autocomplete
                  multiple
                  size="small"
                  fullWidth
                  options={categories}
                  onChange={(e, value) => {
                    setParams({ ...params, categories: value });
                  }}
                  value={params.categories || []}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label=""
                      placeholder="Categories and Niches"
                    />
                  )}
                />
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
              }}
            >
              <Typography variant="h6" fontSize={18}>
                Ships
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                }}
              >
                <Autocomplete
                  multiple
                  size="small"
                  fullWidth
                  options={countries}
                  onChange={(e, value) => {
                    setParams({ ...params, ship_from: value });
                  }}
                  value={params.ship_from || []}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} label="" placeholder="Ships From" />
                  )}
                />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Box
              sx={{
                flex: 1,
              }}
            >
              <Typography variant="h6" fontSize={18}>
                Price
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                }}
              >
                <TextField
                  size="small"
                  fullWidth
                  value={params.price?.min == null ? "" : params.price?.min}
                  onChange={(e) => {
                    setParams({
                      ...params,
                      price: {
                        min: e.target.value,
                        max: props?.params?.price?.max,
                      },
                    });
                  }}
                  type="number"
                  placeholder="Min"
                />
                <TextField
                  size="small"
                  fullWidth
                  value={params.price?.max == null ? "" : params.price?.max}
                  onChange={(e) => {
                    setParams({
                      ...params,
                      price: {
                        max: e.target.value,
                        min: props?.params?.price?.min,
                      },
                    });
                  }}
                  type="number"
                  placeholder="Max"
                />
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
              }}
            >
              <Typography variant="h6" fontSize={18}>
                Orders
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                }}
              >
                <TextField
                  size="small"
                  fullWidth
                  value={params.orders?.min == null ? "" : params.orders?.min}
                  onChange={(e) => {
                    setParams({
                      ...params,
                      orders: {
                        min: e.target.value,
                        max: props?.params?.orders?.max,
                      },
                    });
                  }}
                  type="number"
                  placeholder="Min"
                />
                <TextField
                  size="small"
                  fullWidth
                  value={params.orders?.max == null ? "" : params.orders?.max}
                  onChange={(e) => {
                    setParams({
                      ...params,
                      orders: {
                        max: e.target.value,
                        min: props?.params?.orders?.min,
                      },
                    });
                  }}
                  type="number"
                  placeholder="Max"
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Box
              sx={{
                flex: 1,
              }}
            >
              <Typography variant="h6" fontSize={18}>
                Stores Selling
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                }}
              >
                <TextField
                  size="small"
                  fullWidth
                  value={
                    params.store_selling?.min == null
                      ? ""
                      : params.store_selling?.min
                  }
                  onChange={(e) => {
                    setParams({
                      ...params,
                      store_selling: {
                        min: e.target.value,
                        max: props?.params?.store_selling?.max,
                      },
                    });
                  }}
                  type="number"
                  placeholder="Min"
                />
                <TextField
                  size="small"
                  fullWidth
                  value={
                    params.store_selling?.max == null
                      ? ""
                      : params.store_selling?.max
                  }
                  onChange={(e) => {
                    setParams({
                      ...params,
                      store_selling: {
                        max: e.target.value,
                        min: props?.params?.store_selling?.min,
                      },
                    });
                  }}
                  type="number"
                  placeholder="Max"
                />
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}></Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Button
            onClick={() => {
              props?.setParams({
                price: { min: null, max: null },
                orders: { min: null, max: null },
                store_selling: { min: null, max: null },
                categories: [],
                ship_from: [],
              });
            }}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              props?.setParams({
                ...props?.params,
                ...params,
              });
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
