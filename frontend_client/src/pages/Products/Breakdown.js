import {
  Box,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Slider,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
const css = `
`;

export default function Breakdown({ initPrice, handleClose }) {
  const [price, setPrice] = useState(initPrice);
  const [orders, setOrders] = useState(25000);
  const [profit, setProfit] = useState(0);
  const [cost, setCost] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [fee, setFee] = useState(0);
  const [cpa, setCPA] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [becpa, setBECPA] = useState(0);
  const [beroas, setBEROAS] = useState(0);
  const [pfm, setPFM] = useState(0);

  useEffect(() => {
    setCPA((price / 3).toFixed(2));
    setFee(((price / 100) * 2.9 + 0.3).toFixed(2));
  }, [price]);

  useEffect(() => {
    setBECPA(price == 0 ? 0 : (price - cost - shipping - fee).toFixed(2));
  }, [fee, cost, shipping]);

  useEffect(() => {
    setRatio(cost + shipping == 0 ? 0 : (price / (cost + shipping)).toFixed(2));
  }, [shipping, cost, price]);

  useEffect(() => {
    setBEROAS(price ? (price / becpa).toFixed(2) : 0);
  }, [becpa]);

  useEffect(() => {
    setProfit((orders * (becpa - cpa)).toFixed(0));
  }, [orders, becpa, cpa]);

  useEffect(() => {
    setPFM((price == 0 ? 0 : ((becpa - cpa) / price) * 100).toFixed(2));
  }, [becpa, price]);

  return (
    <>
      <style>{css}</style>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        <Typography variant="h5">Numbers Breakdown</Typography>
        <Typography
          variant="subtitle1"
          sx={{ width: "80%", color: "gray", py: 1, lineHeight: 1.5 }}
        >
          Inpu t the cost of good sold and shipping cost per item to get the
          numbers breakdown on the product. Other numbers can also be customized
          to your needs.
        </Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              Selling Price
              <Tooltip title="This is the price you plan on charging your customers.">
                <ErrorIcon
                  fontSize="small"
                  sx={{
                    color: "gray",
                    ":hover": {
                      color: "black",
                    },
                  }}
                />
              </Tooltip>
            </Typography>
            <TextField
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              sx={{ m: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonetizationOnOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Slider
              onChange={(e, v) => setPrice(v)}
              value={price}
              max={500}
              min={0}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              Example Orders
              <Tooltip title="The amount of units you expect to sell. This is the default value we put across all products.">
                <ErrorIcon
                  fontSize="small"
                  sx={{
                    color: "gray",
                    ":hover": {
                      color: "black",
                    },
                  }}
                />
              </Tooltip>
            </Typography>
            <TextField
              type="number"
              value={orders}
              onChange={(e) => setOrders(e.target.value)}
              sx={{ m: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalGroceryStoreIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Slider
              value={orders}
              onChange={(e, v) => setOrders(v)}
              min={0}
              max={100000}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              POT. Profit
              <Tooltip title="The potential profit is calculated by subtracting BECPA with the CPA of the product, and the difference is multiplied by 25,000 to give you an idea of the potential profit if you sold that many units.">
                <ErrorIcon
                  fontSize="small"
                  sx={{
                    color: "gray",
                    ":hover": {
                      color: "black",
                    },
                  }}
                />
              </Tooltip>
            </Typography>
            <TextField
              value={profit}
              sx={{ m: 1 }}
              InputProps={{
                style: {
                  fontWeight: 500,
                  fontSize: 18,
                  color: "#151e3a",
                  background: "#f2f3f8",
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="h6">≈ $ </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              Est. Cost of Good Sold
              <Tooltip title="The amount you expect to pay your supplier for each unit.">
                <ErrorIcon
                  fontSize="small"
                  sx={{
                    color: "gray",
                    ":hover": {
                      color: "black",
                    },
                  }}
                />
              </Tooltip>
            </Typography>
            <TextField
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              sx={{ m: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonetizationOnOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              Est. Shipping Cost
              <Tooltip title="The amount you expect to pay your supplier for each unit shipped.">
                <ErrorIcon
                  fontSize="small"
                  sx={{
                    color: "gray",
                    ":hover": {
                      color: "black",
                    },
                  }}
                />
              </Tooltip>
            </Typography>
            <TextField
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
              type="number"
              sx={{ m: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonetizationOnOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              Est. Fees Per Order
              <Tooltip title="The estimated fee you expect to pay your payment processor per order. Calculated as 2.9% + $0.3 per order.">
                <ErrorIcon
                  fontSize="small"
                  sx={{
                    color: "gray",
                    ":hover": {
                      color: "black",
                    },
                  }}
                />
              </Tooltip>
            </Typography>
            <TextField
              value={fee}
              onChange={(e) => {
                if (e.target.value > (price / 100) * 2.9 + 0.3)
                  setFee(e.target.value);
              }}
              type="number"
              sx={{ m: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonetizationOnOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              Est. CPA
              <Tooltip title="The amount you expect to spend for a conversion. It is calculated as a third of “Selling Price”.">
                <ErrorIcon
                  fontSize="small"
                  sx={{
                    color: "gray",
                    ":hover": {
                      color: "black",
                    },
                  }}
                />
              </Tooltip>
            </Typography>
            <TextField
              value={cpa}
              sx={{ m: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonetizationOnOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              P/C Ratio
              <Tooltip title="The price to cost ratio is calculated by dividing the product cost with the selling price.">
                <ErrorIcon
                  fontSize="small"
                  sx={{
                    color: "gray",
                    ":hover": {
                      color: "black",
                    },
                  }}
                />
              </Tooltip>
            </Typography>
            <TextField
              value={ratio + "X"}
              InputProps={{
                style: {
                  background: "#f2f6ff",
                  color: "#225aea",
                },
              }}
              sx={{ m: 1 }}
            />
          </Box>
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              BECPA
              <Tooltip title="The breakeven cost per acquisition (BECPA) is the maximum CPA you should aim to get to breakeven on the product.">
                <ErrorIcon
                  fontSize="small"
                  sx={{
                    color: "gray",
                    ":hover": {
                      color: "black",
                    },
                  }}
                />
              </Tooltip>
            </Typography>
            <TextField
              value={"$" + becpa}
              sx={{ m: 1 }}
              InputProps={{
                style: {
                  background: "#f2f6ff",
                  color: "#225aea",
                },
              }}
            />
          </Box>
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              BEROAS
              <Tooltip title="The breakeven return on ad spend (BEROAS) is the minimum ROAS you should aim to get to breakeven on the product.">
                <ErrorIcon
                  fontSize="small"
                  sx={{
                    color: "gray",
                    ":hover": {
                      color: "black",
                    },
                  }}
                />
              </Tooltip>
            </Typography>
            <TextField
              value={beroas}
              InputProps={{
                style: {
                  background: "#f2f6ff",
                  color: "#225aea",
                },
              }}
              sx={{ m: 1 }}
            />
          </Box>
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              Profit Margin
              <Tooltip title="This is the profit margin you can expect after taking into account all the numbers in the “Numbers Breakdown”.">
                <ErrorIcon
                  fontSize="small"
                  sx={{
                    color: "gray",
                    ":hover": {
                      color: "black",
                    },
                  }}
                />
              </Tooltip>
            </Typography>
            <TextField
              value={pfm + "%"}
              InputProps={{
                style: {
                  background: "#f2f6ff",
                  color: "#225aea",
                },
              }}
              sx={{ m: 1 }}
            />
          </Box>
        </Box>
      </DialogContent>
    </>
  );
}
