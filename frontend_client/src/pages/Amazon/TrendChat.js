import React, { useCallback, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Tab,
  Tabs,
} from "@mui/material";
import axios from "../../services/axios";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import Chart from "react-apexcharts";

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

export default function TrendChat(props) {
  const { product } = props;
  const [ordersTrends, setOrdersTrends] = React.useState();
  const [chartTabIndex, setChartTabIndex] = React.useState(0);

  const handleChartTabChange = (event, newValue) => {
    setChartTabIndex(newValue);
  };

  const fetchData = useCallback(() => {
    axios
      .post("/api/amazon/getCharts", { productId: product.productId })
      .then((response) => setOrdersTrends(response.data))
      .catch((err) => console.log(err));
  }, [product?.productId]);

  useEffect(() => {
    if (!product) return;
    fetchData();
  }, [fetchData, product]);

  if (product === null) return null;

  return (
    <Dialog
      fullWidth
      maxWidth={"xl"}
      open={props?.open}
      onClose={props?.onClose}
    >
      <DialogTitle>Real Trends Chart</DialogTitle>
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
      </DialogContent>
    </Dialog>
  );
}
