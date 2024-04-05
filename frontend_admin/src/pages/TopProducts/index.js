import React, { useEffect } from "react";
import SearchBar from "./SearchBar";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  Stack,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  loadParams,
  setParams,
} from "../../redux/sales/topProductSlice";
import ErrorIcon from "@mui/icons-material/Error";
import FacebookIcon from "@mui/icons-material/Facebook";

import Chart from "react-apexcharts";

export default function TopProducts() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.topproducts);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [data_, setData_] = React.useState([]);
  const [subPage, setSubPage] = React.useState(0);

  const handleScroll = () => {
    const { scrollHeight, clientHeight, scrollTop } = document.documentElement;
    if (scrollHeight - scrollTop < clientHeight + 60) {
      if (subPage * 10 < rowsPerPage) {
        setSubPage(subPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [subPage, window]);

  useEffect(() => {
    setData_(data.products.slice(0, (subPage + 1) * 10));
  }, [subPage, data.products]);
  useEffect(() => {
    dispatch(loadParams());
  }, []);

  useEffect(() => {
    if (data.inited) dispatch(getProducts(data.params));
    setSubPage(0);
  }, [data.params, data.inited]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dispatch(setParams({ ...data.params, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    dispatch(setParams({ ...data.params, page_size: event.target.value }));
    setPage(0);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        pt: 2,
      }}
    >
      <SearchBar />
      <Card
        sx={{
          boxShadow: "0 0 16px rgba(0, 0, 0, 0.16)",
        }}
      >
        <CardHeader title={"Products"} />
        <CardContent>
          <Stack>
            <TablePagination
              component="div"
              count={data.total}
              page={data.params.page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {data.loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 200,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.2,
                }}
              >
                {data_.map((p) => {
                  const categories = [];
                  const series = [];
                  p.aggregations?.month?.revenue?.map((c) => {
                    categories.push(c.date);
                    series.push(c.value.toFixed(0));
                  });
                  return (
                    <Box key={p.id}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderRadius: 2,
                          bgcolor: "#e3f6fb",
                          p: 1,
                        }}
                      >
                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            p: 1,
                          }}
                        >
                          <Avatar
                            src={p.main_image}
                            variant="rounded"
                            sx={{
                              width: 68,
                              height: 68,
                            }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle1"
                              noWrap
                              sx={{
                                maxWidth: 300,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {p.title}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography variant="subtitle2" color={"gray"}>
                                ${p.usd_price}
                              </Typography>
                              <Link href={`https://${p.custom_domain}`}>
                                {`${p.custom_domain}`}
                              </Link>
                              <Tooltip
                                color={"gray"}
                                title={p.custom_domain_search}
                              >
                                <ErrorIcon fontSize="small" color="disabled" />
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                        <Stack
                          sx={{
                            flex: 1,
                          }}
                          spacing={1}
                          divider={<Divider />}
                          direction={"row"}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              fontSize={14}
                              color={"gray"}
                            >
                              Total Revenue
                            </Typography>
                            <Typography variant="h6" fontSize={17}>
                              ${p.month_revenue?.toFixed(2)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              fontSize={14}
                              color={"gray"}
                            >
                              Total Sales
                            </Typography>
                            <Typography variant="h6" fontSize={17}>
                              {p.month_sales?.toFixed(0)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              fontSize={14}
                              color={"gray"}
                            >
                              Tracked By
                              <Typography
                                variant="h6"
                                fontSize={17}
                                color={"black"}
                              >
                                {p.tracked_by || 0} Others
                              </Typography>
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              fontSize={14}
                              color={"gray"}
                            >
                              Creation Date
                            </Typography>
                            <Typography variant="h6" fontSize={17}>
                              {`${
                                new Date(p.created_at).getMonth() + 1
                              }/${new Date(p.created_at).getDate()},${new Date(
                                p.created_at
                              ).getFullYear()}`}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box
                          sx={{
                            px: 2,
                          }}
                        >
                          <IconButton
                            sx={{
                              bgcolor: "white",
                            }}
                            href={`${p.facebook_add_library}`}
                          >
                            <FacebookIcon
                              sx={{
                                color: "#000",
                              }}
                            />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box sx={{}}>
                        <Chart
                          height={400}
                          options={{
                            chart: {
                              type: "line",
                              zoom: {
                                enabled: false,
                              },
                            },
                            dataLabels: {
                              enabled: false,
                            },
                            stroke: {
                              curve: "straight",
                            },
                            xaxis: {
                              categories: categories,
                            },
                          }}
                          series={[
                            {
                              name: "",
                              data: series,
                            },
                          ]}
                          type="line"
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
