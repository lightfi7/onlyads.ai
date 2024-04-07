import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  MenuItem,
  Select,
  Skeleton,
  Tab,
  Tabs,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Chart from "react-apexcharts";
import { PieChart } from "@mui/x-charts/PieChart";
import { Gauge } from "@mui/x-charts/Gauge";
import { useDrawingArea } from "@mui/x-charts/hooks";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import HouseSidingOutlinedIcon from "@mui/icons-material/HouseSidingOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CallMadeIcon from "@mui/icons-material/CallMade";
import StarIcon from "@mui/icons-material/Star";
import EastIcon from "@mui/icons-material/East";
import axios from "../../services/axios";
import AISupplierList from "./AISupplierList";
import CloseIcon from "@mui/icons-material/Close";
import ReactPlayer from "react-player";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

function renderChart({ type, arr }) {
  const tick = arr?.tick;
  const _arr = arr.rows.filter((item) => item.label === type);
  const data = _arr.length ? _arr[0].data : [];
  const prefix = _arr.length ? _arr[0].prefix || "" : "";
  return (
    <Chart
      options={{
        chart: {
          id: "@chart",
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: tick,
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return `${prefix}${value}`;
            },
          },
        },
      }}
      series={[
        {
          name: "",
          data: data,
        },
      ]}
      type="area"
      // width={500}
      height={360}
    />
  );
}

export default function ProductDetails(props) {
  const product = props?.product;
  const matches = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showSuppliers, setShowSuppliers] = useState(false);
  const [trendOption, setTrendOption] = useState("Orders Trend");
  const [chartTabIndex, setChartTabIndex] = React.useState(0);
  const [sellingOnTabIndex, setSellingOnTabIndex] = React.useState(0);
  const [topCustomerCountries, setTopCustomerCountries] = React.useState([]);
  const [storesCountryBreakdown, setStoresCountryBreakdown] = React.useState(
    []
  );
  const [competitionMeter, setCompetitionMeter] = React.useState({
    value: 0,
    label: "Competition",
  });

  const [ordersTrends, setOrdersTrends] = React.useState();
  const [storeTrends, setStoreTrends] = React.useState();

  const handleChartTabChange = (event, newValue) => {
    setChartTabIndex(newValue);
  };

  const handleSellingOnTabChange = (event, newValue) => {
    setSellingOnTabIndex(newValue);
  };

  useEffect(() => {
    if (!product) return;
    axios
      .post("/api/nexus/getCharts", { productId: product.productId })
      .then((response) => setOrdersTrends(response.data))
      .catch((err) => console.log(err));
    axios
      .post("/api/nexus/getTrends", { productId: product.productId })
      .then((response) => setStoreTrends(response.data))
      .catch((err) => console.log(err));
    setCompetitionMeter({
      value: product.productCompetition?.chartData?.competition_meter,
      label: product.productCompetition?.chartData?.label,
    });
    let topCustomerCountries_ = [];
    for (let i in product.productTopCustomerCountry?.chartData.countries
      .percent) {
      topCustomerCountries_.push({
        value:
          product.productTopCustomerCountry?.chartData.countries.percent[i],
        label: product.productTopCustomerCountry?.chartData.countries.name[i],
      });
    }
    let storesCountryBreakdown_ = [];
    for (let i in product.productStoresCountryBreakdown?.chartData.countries
      .percent) {
      storesCountryBreakdown_.push({
        value:
          product.productStoresCountryBreakdown?.chartData.countries.percent[i],
        label:
          product.productStoresCountryBreakdown?.chartData.countries.name[i],
      });
    }
    setTopCustomerCountries(topCustomerCountries_);
    setStoresCountryBreakdown(storesCountryBreakdown_);
  }, [product]);

  if (product === null) return null;

  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"xxl"}
        open={props?.open}
        onClose={props?.onClose}
      >
        <DialogTitle>Product Details</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            props?.onClose();
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
        <DialogContent>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                minWidth: { xs: "100%", sm: 240, md: 320 },
                width: { xs: "100%", sm: 240, md: 320 },
                height: { xs: "100%", sm: 240, md: 320 },
              }}
            >
              {showVideo && product?.videoURL ? (
                <ReactPlayer
                  ref={videoRef}
                  playing={showVideo}
                  url={product?.videoURL}
                  controls
                  width={{ xs: "100%", sm: 240, md: 320 }}
                  sx={{
                    maxHeight: { xs: "100%", sm: 240, md: 320 },
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                  variant="square"
                  alt="Product Image"
                  src={product?.imageURL}
                />
              )}
              {product?.videoURL && (
                <IconButton
                  onClick={() => setShowVideo((prev) => !prev)}
                  sx={{
                    width: 0,
                    height: 0,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    zIndex: 1000,
                  }}
                >
                  {!showVideo ? (
                    <PlayCircleOutlineIcon
                      sx={{
                        color: "#fff",
                        fontSize: 60,
                      }}
                    />
                  ) : (
                    <PauseCircleOutlineIcon
                      sx={{
                        color: "#fff",
                        fontSize: 60,
                      }}
                    />
                  )}
                </IconButton>
              )}
            </Box>
            <Box
              sx={{
                flex: 1,
              }}
            >
              <Typography variant="h4">{product?.productName}</Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {product?.addedLabel && (
                  <Box
                    sx={{
                      display: "flex",
                      flex: 1,
                      gap: 0.5,
                      alignItems: "center",
                    }}
                  >
                    <CalendarMonthIcon color="disabled" />
                    <Typography color={"gray"} fontSize={14}>
                      {product?.addedLabel}
                    </Typography>
                  </Box>
                )}
                {product?.foundLabel && (
                  <Box
                    sx={{
                      display: "flex",
                      flex: 1,
                      gap: 0.5,
                      alignItems: "center",
                    }}
                  >
                    <ErrorOutlineIcon color="disabled" />
                    <Typography color={"gray"} fontSize={14}>
                      {product?.foundLabel}
                    </Typography>
                  </Box>
                )}
              </Box>
              {/* Tags */}
              {matches && (
                <>
                  <Grid container spacing={1} sx={{ mt: 3 }}>
                    <Grid item xs={6} sm={6} md={3}>
                      <Box
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          px: 2,
                          py: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <DescriptionIcon />
                        <Box>
                          <Typography variant="h6">
                            {product?.productOrders}
                          </Typography>
                          <Typography variant="subtitle2">Orders</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                      <Box
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          px: 2,
                          py: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <MonetizationOnOutlinedIcon />
                        <Box>
                          <Typography variant="h6">
                            ${product?.productCost ? product?.productCost : 0}
                          </Typography>
                          <Typography variant="subtitle2">
                            Product cost
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                      <Box
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          px: 2,
                          py: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <LocalOfferOutlinedIcon />
                        <Box>
                          <Typography variant="h6">
                            $
                            {product?.productSellingPrice
                              ? product?.productSellingPrice
                              : 0}
                          </Typography>
                          <Typography variant="subtitle2">
                            Selling price
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                      <Box
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          px: 2,
                          py: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <AutoGraphOutlinedIcon />
                        <Box>
                          <Typography variant="h6">
                            {product?.productProfitMargin
                              ? product?.productProfitMargin
                              : 0}
                          </Typography>
                          <Typography variant="subtitle2">
                            Profit margin
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                      <Box
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          px: 2,
                          py: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <ShoppingBagOutlinedIcon />
                        <Box>
                          <Typography variant="h6">
                            ${product?.productTotalSalesCount}
                          </Typography>
                          <Typography variant="subtitle2">
                            Total sales
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                      <Box
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          px: 2,
                          py: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <HouseSidingOutlinedIcon />
                        <Box>
                          <Typography variant="h6">
                            {product?.productSupplieCount}
                          </Typography>
                          <Typography variant="subtitle2">
                            # of suppliers
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                      <Box
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          px: 2,
                          py: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <StorefrontOutlinedIcon />
                        <Box>
                          <Typography variant="h6">
                            {product?.productStoreSellingCount}
                          </Typography>
                          <Typography variant="subtitle2">
                            # stores selling
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                      <Box
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          px: 2,
                          py: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <FavoriteBorderOutlinedIcon />
                        <Box>
                          <Typography variant="h6">
                            {product?.productInsightRating}
                          </Typography>
                          <Typography variant="subtitle2">
                            Product Insights
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      mt: 3,
                    }}
                  >
                    <Button
                      size="large"
                      sx={{
                        color: "#007bff",
                        borderColor: "#007bff",
                        "&:hover": {
                          borderColor: "#007bff",
                        },
                      }}
                      variant="outlined"
                      target="_blank"
                      href={product.productFaceBookAds}
                      startIcon={<FacebookIcon />}
                    >
                      See Facebook Ads
                    </Button>
                    <Button
                      size="large"
                      sx={{
                        color: "#ed116f",
                        borderColor: "#ed116f",
                        "&:hover": {
                          borderColor: "#ed116f",
                        },
                      }}
                      variant="outlined"
                      target="_blank"
                      href={product.productYoutubeAds}
                      startIcon={<YouTubeIcon />}
                    >
                      Find on Youtube
                    </Button>
                    <Button
                      size="large"
                      sx={{
                        color: "#ea9736",
                        borderColor: "#ea9736",
                        "&:hover": {
                          borderColor: "#ea9736",
                        },
                      }}
                      variant="outlined"
                      target="_blank"
                      href={product.productAmazonAds}
                      startIcon={
                        <img src="/imgs/amazon.png" alt="amazon" width={18} />
                      }
                    >
                      Find on Amazon
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Box>
          {!matches && (
            <>
              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={6} sm={6} md={3}>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <DescriptionIcon />
                    <Box>
                      <Typography variant="h6">
                        {product?.productOrders}
                      </Typography>
                      <Typography variant="subtitle2">Orders</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <MonetizationOnOutlinedIcon />
                    <Box>
                      <Typography variant="h6">
                        ${product?.productCost ? product?.productCost : 0}
                      </Typography>
                      <Typography variant="subtitle2">Product cost</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <LocalOfferOutlinedIcon />
                    <Box>
                      <Typography variant="h6">
                        $
                        {product?.productSellingPrice
                          ? product?.productSellingPrice
                          : 0}
                      </Typography>
                      <Typography variant="subtitle2">Selling price</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <AutoGraphOutlinedIcon />
                    <Box>
                      <Typography variant="h6">
                        {product?.productProfitMargin
                          ? product?.productProfitMargin
                          : 0}
                      </Typography>
                      <Typography variant="subtitle2">Profit margin</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <ShoppingBagOutlinedIcon />
                    <Box>
                      <Typography variant="h6">
                        ${product?.productTotalSalesCount}
                      </Typography>
                      <Typography variant="subtitle2">Total sales</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <HouseSidingOutlinedIcon />
                    <Box>
                      <Typography variant="h6">
                        {product?.productSupplieCount}
                      </Typography>
                      <Typography variant="subtitle2">
                        # of suppliers
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <StorefrontOutlinedIcon />
                    <Box>
                      <Typography variant="h6">
                        {product?.productStoreSellingCount}
                      </Typography>
                      <Typography variant="subtitle2">
                        # stores selling
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <FavoriteBorderOutlinedIcon />
                    <Box>
                      <Typography variant="h6">
                        {product?.productInsightRating}
                      </Typography>
                      <Typography variant="subtitle2">
                        Product Insights
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 3,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Button
                  size="large"
                  sx={{
                    color: "#007bff",
                    borderColor: "#007bff",
                    "&:hover": {
                      borderColor: "#007bff",
                    },
                  }}
                  variant="outlined"
                  target="_blank"
                  href={product.productFaceBookAds}
                  startIcon={<FacebookIcon />}
                >
                  See Facebook Ads
                </Button>
                <Button
                  size="large"
                  sx={{
                    color: "#ed116f",
                    borderColor: "#ed116f",
                    "&:hover": {
                      borderColor: "#ed116f",
                    },
                  }}
                  variant="outlined"
                  target="_blank"
                  href={product.productYoutubeAds}
                  startIcon={<YouTubeIcon />}
                >
                  Find on Youtube
                </Button>
                <Button
                  size="large"
                  sx={{
                    color: "#ea9736",
                    borderColor: "#ea9736",
                    "&:hover": {
                      borderColor: "#ea9736",
                    },
                  }}
                  variant="outlined"
                  target="_blank"
                  href={product.productAmazonAds}
                  startIcon={
                    <img src="/imgs/amazon.png" alt="amazon" width={18} />
                  }
                >
                  Find on Amazon
                </Button>
              </Box>
            </>
          )}
          <Box sx={{ p: 1, mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={8}>
                <Box
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    p: 3,
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h5">Real trends chart</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" color={"gray"} fontSize={16}>
                        Show
                      </Typography>
                      <Select
                        size="small"
                        value={trendOption}
                        onChange={(e) => {
                          setTrendOption(e.target.value);
                          setChartTabIndex(0);
                        }}
                        sx={{
                          borderRadius: 8,
                        }}
                      >
                        <MenuItem value={"Orders Trend"}>Orders Trend</MenuItem>
                        <MenuItem value={"Stores Trend"}>Stores Trend</MenuItem>
                      </Select>
                    </Box>
                  </Box>
                  {trendOption === "Orders Trend" ? (
                    <>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                          value={chartTabIndex}
                          onChange={handleChartTabChange}
                          aria-label="basic tabs example"
                        >
                          <Tab label="Orders" {...a11yProps(0)} />
                          <Tab label="Price" {...a11yProps(1)} />
                          <Tab label="Rating" {...a11yProps(2)} />
                          <Tab label="Reviews" {...a11yProps(3)} />
                        </Tabs>
                      </Box>
                      <CustomTabPanel value={chartTabIndex} index={0}>
                        {ordersTrends ? (
                          renderChart({
                            type: "Ranking",
                            arr: ordersTrends,
                          })
                        ) : (
                          <Skeleton height={320} />
                        )}
                      </CustomTabPanel>
                      <CustomTabPanel value={chartTabIndex} index={1}>
                        {ordersTrends ? (
                          renderChart({
                            type: "Rating",
                            arr: ordersTrends,
                          })
                        ) : (
                          <Skeleton height={320} />
                        )}
                      </CustomTabPanel>
                      <CustomTabPanel value={chartTabIndex} index={2}>
                        {ordersTrends ? (
                          renderChart({
                            type: "Price",
                            arr: ordersTrends,
                          })
                        ) : (
                          <Skeleton height={320} />
                        )}
                      </CustomTabPanel>
                      <CustomTabPanel value={chartTabIndex} index={3}>
                        {ordersTrends ? (
                          renderChart({
                            type: "Reviews",
                            arr: ordersTrends,
                          })
                        ) : (
                          <Skeleton height={320} />
                        )}
                      </CustomTabPanel>
                    </>
                  ) : (
                    <>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                          value={chartTabIndex}
                          onChange={handleChartTabChange}
                          aria-label="basic tabs example"
                        >
                          <Tab label="Added to Store Trend" {...a11yProps(0)} />
                          <Tab
                            label="Added to Store by Day"
                            {...a11yProps(1)}
                          />
                        </Tabs>
                      </Box>
                      <CustomTabPanel value={chartTabIndex} index={0}>
                        {ordersTrends ? (
                          renderChart({
                            type: "Added to Store Trend",
                            arr: storeTrends,
                          })
                        ) : (
                          <Skeleton height={320} />
                        )}
                      </CustomTabPanel>
                      <CustomTabPanel value={chartTabIndex} index={1}>
                        {ordersTrends ? (
                          renderChart({
                            type: "Added to Store by Day",
                            arr: storeTrends,
                          })
                        ) : (
                          <Skeleton height={320} />
                        )}
                      </CustomTabPanel>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <Box
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Box sx={{ p: 1 }}>
                    <Typography variant="h6">Orders Statistics</Typography>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: 1,
                          borderColor: "divider",
                          gap: 2,
                          py: 2,
                        }}
                      >
                        <Typography variant="h6" fontSize={18}>
                          Total last 6 months
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Typography variant="h6" fontSize={18}>
                            {product?.productOrdersStatistics?.month6.v}
                          </Typography>
                          {product?.productOrdersStatistics?.month6.m ? (
                            <KeyboardArrowUpIcon color="primary" />
                          ) : (
                            <KeyboardArrowDownIcon color="error" />
                          )}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: 1,
                          borderColor: "divider",
                          gap: 2,
                          py: 2,
                        }}
                      >
                        <Typography variant="h6" fontSize={18}>
                          Total last 30 days
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Typography variant="h6" fontSize={18}>
                            {product?.productOrdersStatistics?.days30.v}
                          </Typography>
                          {product?.productOrdersStatistics?.days30.m ? (
                            <KeyboardArrowUpIcon color="primary" />
                          ) : (
                            <KeyboardArrowDownIcon color="error" />
                          )}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: 1,
                          borderColor: "divider",
                          gap: 2,
                          py: 2,
                        }}
                      >
                        <Typography variant="h6" fontSize={18}>
                          Total last 14 days
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Typography variant="h6" fontSize={18}>
                            {product?.productOrdersStatistics?.days14.v}
                          </Typography>
                          {product?.productOrdersStatistics?.days14.m ? (
                            <KeyboardArrowUpIcon color="primary" />
                          ) : (
                            <KeyboardArrowDownIcon color="error" />
                          )}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: 1,
                          borderColor: "divider",
                          gap: 2,
                          py: 2,
                        }}
                      >
                        <Typography variant="h6" fontSize={18}>
                          Total last 7 days
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Typography variant="h6" fontSize={18}>
                            {product?.productOrdersStatistics?.days7.v}
                          </Typography>
                          {product?.productOrdersStatistics?.days7.m ? (
                            <KeyboardArrowUpIcon color="primary" />
                          ) : (
                            <KeyboardArrowDownIcon color="error" />
                          )}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: 1,
                          borderColor: "divider",
                          gap: 2,
                          py: 2,
                        }}
                      >
                        <Typography variant="h6" fontSize={18}>
                          Daily estimate
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Typography variant="h6" fontSize={18}>
                            {product?.productOrdersStatistics?.daily.v}
                          </Typography>
                          {product?.productOrdersStatistics?.daily.m ? (
                            <KeyboardArrowUpIcon color="primary" />
                          ) : (
                            <KeyboardArrowDownIcon color="error" />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={8}>
                <Box
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Box sx={{ p: 1 }}>
                    <Typography variant="h5">Product Insights</Typography>
                    <Box
                      sx={{
                        mt: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {product?.productInsights?.map((insight, i) => (
                        <Box sx={{ display: "flex", gap: 1 }} key={i}>
                          {insight.status == "good" ? (
                            <CheckCircleOutlineIcon color="primary" />
                          ) : (
                            <HighlightOffIcon color="error" />
                          )}
                          <Typography variant="h6" fontSize={18}>
                            {insight.title}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <Box
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Box sx={{ p: 1 }}>
                    <Box>
                      <Typography variant="h6" textAlign={"center"}>
                        Competition meter
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Gauge
                        width={256}
                        height={256}
                        value={competitionMeter.value}
                        valueMax={100}
                        // sx={{
                        //   [`& .${gaugeClasses.valueText}`]: {
                        //     fontSize: 18,
                        //     transform: "translate(0px, 0px)",
                        //   },
                        // }}
                        text={({ value, valueMax }) =>
                          `${value}% ${competitionMeter.label}`
                        }
                        innerRadius="90%"
                        outerRadius="100%"
                        cornerRadius="50%"
                        startAngle={-90}
                        endAngle={90}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ p: 1 }}>
                    <Box>
                      <Typography variant="h6" textAlign={"center"}>
                        Top customer countries
                      </Typography>
                    </Box>
                    <Box sx={{ py: 2 }}>
                      <PieChart
                        height={256}
                        series={[
                          {
                            data: topCustomerCountries,
                            innerRadius: "90%",
                            paddingAngle: 1,
                            cornerRadius: 10,
                          },
                        ]}
                        margin={{ right: 5 }}
                        slotProps={{
                          legend: {
                            hidden: true,
                          },
                        }}
                      >
                        <PieCenterLabel>
                          {topCustomerCountries.length} countries
                        </PieCenterLabel>
                      </PieChart>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={8}>
                <Box
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Box sx={{ p: 1 }}>
                    <Typography variant="h6">Selling on</Typography>
                    <Box>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                          value={sellingOnTabIndex}
                          onChange={handleSellingOnTabChange}
                          aria-label="basic tabs example"
                        >
                          <Tab label="Selling Stores" {...a11yProps(0)} />
                          <Tab label="Suppliers" {...a11yProps(1)} />
                        </Tabs>
                      </Box>
                      <CustomTabPanel value={sellingOnTabIndex} index={0}>
                        <Grid
                          container
                          spacing={2}
                          sx={{
                            mt: 1,
                          }}
                        >
                          {product?.productSellingStores?.map((store, i) => (
                            <Grid item xs={12} sm={12} md={6} key={i}>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                }}
                              >
                                {store.location ? (
                                  <img
                                    width={18}
                                    src={require(`/${store.location.toLowerCase()}.svg`)}
                                  />
                                ) : (
                                  <HelpOutlineIcon
                                    fontSize="small"
                                    sx={{
                                      color: "gray",
                                    }}
                                  />
                                )}
                                {/* Store Intelligence */}
                                {/* Store All Products */}
                                <Link
                                  href={store.store.link}
                                  target="_blank"
                                  underline="none"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography>{store.store.title}</Typography>
                                  <CallMadeIcon fontSize="small" />
                                </Link>
                                <Link
                                  href={store.facebook}
                                  target="_blank"
                                  underline="none"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <FacebookIcon fontSize="small" /> See Ads
                                </Link>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </CustomTabPanel>
                      <CustomTabPanel value={sellingOnTabIndex} index={1}>
                        <Grid
                          container
                          spacing={2}
                          sx={{
                            mt: 1,
                          }}
                        >
                          {product?.productSupplies?.map((supplier, i) => (
                            <Grid item xs={12} sm={6} key={i}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <img
                                  src={`/imgs/${supplier.location}.png`}
                                  width={20}
                                  height={20}
                                />
                                {/* Store Intelligence */}
                                {/* Store All Products */}
                                <Link
                                  href={supplier.supplier.link}
                                  target="_blank"
                                  underline="none"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography>
                                    {supplier.supplier.title?.slice(0, 10)}...
                                  </Typography>
                                  <CallMadeIcon fontSize="small" />
                                </Link>
                                <Typography
                                  variant="h6"
                                  fontSize={18}
                                  color={"gray"}
                                >
                                  ${supplier.price}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <StarIcon
                                    fontSize="small"
                                    sx={{
                                      color: "#ffc107",
                                    }}
                                  />
                                  <Typography
                                    variant="h6"
                                    fontSize={18}
                                    color={"gray"}
                                  >
                                    {supplier.rating}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                        <Button
                          onClick={() => {
                            setShowSuppliers(true);
                          }}
                          endIcon={<EastIcon />}
                          sx={{
                            mt: 2,
                          }}
                        >
                          Find More Suppliers
                        </Button>
                      </CustomTabPanel>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <Box
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Box>
                    <Typography variant="h6" textAlign={"center"}>
                      Stores Country Breakdown
                    </Typography>
                  </Box>
                  <Box sx={{ py: 2 }}>
                    <PieChart
                      height={256}
                      series={[
                        {
                          data: storesCountryBreakdown,
                          innerRadius: "90%",
                          paddingAngle: 1,
                          cornerRadius: 10,
                        },
                      ]}
                      margin={{ right: 5 }}
                      slotProps={{
                        legend: {
                          hidden: true,
                        },
                      }}
                    >
                      <PieCenterLabel>
                        {storesCountryBreakdown.length} countries
                      </PieCenterLabel>
                    </PieChart>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
      <AISupplierList
        open={showSuppliers}
        onClose={() => {
          setShowSuppliers(false);
        }}
        productId={product?.productId}
      />
    </>
  );
}
