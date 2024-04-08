import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const categories = [
  "All Electronics",
  "Amazon Home",
  "Appliances",
  "Baby",
  "Health & Personal Care",
  "Industrial & Scientific",
  "Pet Supplies",
  "Tools & Home Improvement",
  "Air conditioner",
  "Android",
  "Baby",
  "Baby feeding",
  "Backpack",
  "Bathroom Accessories",
  "Beach",
  "Beard Accessories",
  "Beauty",
  "Bodybuilding",
  "Bracelet",
  "Buddhism",
  "Butterfly",
  "Camping",
  "Cars",
  "Cats",
  "Christianity",
  "Christmas",
  "Cleaning",
  "Coffee",
  "Cooking",
  "Couples",
  "Cycling",
  "DIY & Lifehacks",
  "Dogs",
  "Drawing",
  "Fishing",
  "Fitness",
  "Fitness Tracker",
  "Gaming",
  "Gardening",
  "Golf",
  "Gothic fashion",
  "Guitar",
  "Hair Products",
  "Halloween",
  "Heating",
  "Hiking",
  "Home decor",
  "Humidifier",
  "Hunting",
  "Iphone",
  "Iphone screen protector",
  "Jewelry",
  "Kids Toys",
  "Kitchen",
  "Lamp (household item)",
  "Luxury Watches",
  "Massage",
  "Men's Fashion",
  "Microphones",
  "Motorcycle",
  "Music",
  "Nails",
  "Natural health",
  "Necklace",
  "Novelty",
  "Painting",
  "Phone Accessories",
  "Phone cable",
  "Quarantine (Home Essentials)",
  "Robot Cleaner",
  "Scarf",
  "School Bag",
  "Skin Care",
  "Smart Watch",
  "STEM Toys",
  "Storage (holders, containers)",
  "Summer",
  "Tactical",
  "Tea",
  "Teeth Whitening",
  "Travel",
  "Watches",
  "Water Bottles",
  "Weight Loss",
  "Whiskey",
  "Wine",
  "Winter",
  "Women Sunglasses",
  "Women Wallet",
  "Womens Bags",
  "Womens Fashion",
];

export default function FilterDialog(props) {
  const [params, setParams] = useState({
    price: { min: null, max: null },
    categories: [],
    rank: "any",
  });

  useEffect(() => {
    setParams(props?.params);
  }, [props?.params]);

  return (
    <Dialog
      fullWidth
      maxWidth={"lg"}
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
                categories: [],
                rank: "any",
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
                value={params.price?.min === null ? "" : params.price?.min}
                onChange={(e) => {
                  setParams({
                    ...params,
                    price: {
                      min: e.target.value,
                      max: params?.price?.max,
                    },
                  });
                }}
                type="number"
                placeholder="Min"
              />
              <TextField
                size="small"
                fullWidth
                value={params.price?.max === null ? "" : params.price?.max}
                onChange={(e) => {
                  setParams({
                    ...params,
                    price: {
                      max: e.target.value,
                      min: params?.price?.min,
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
            <FormControl
              onChange={(e) => {
                setParams({ ...params, rank: e.target.value });
              }}
            >
              <FormLabel id="demo-radio-buttons-group-label">
                Rank_Main
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={params.rank}
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="any"
                  control={<Radio />}
                  label="Any Rank"
                />
                <FormControlLabel
                  value=">10"
                  control={<Radio />}
                  label="Top 10"
                />
                <FormControlLabel
                  value=">100"
                  control={<Radio />}
                  label="Top 100"
                />
                <FormControlLabel
                  value=">500"
                  control={<Radio />}
                  label="Top 500"
                />
                <FormControlLabel
                  value=">1000"
                  control={<Radio />}
                  label="Top 1000"
                />
                <FormControlLabel
                  value=">10000"
                  control={<Radio />}
                  label="Top 10000"
                />
              </RadioGroup>
            </FormControl>
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
                categories: [],
                rank: "any",
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
