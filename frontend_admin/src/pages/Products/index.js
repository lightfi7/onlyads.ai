import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import React, { useCallback } from "react";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  loadParams,
  setParams,
} from "../../redux/products/productSlice";
import { useEffect } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import axios from "../../services/axios";
import Breakdown from "./Breakdown";
import Chart from "react-apexcharts";

const ExpandableTableRow = ({
  children,
  id,
  expandComponent,
  ...otherProps
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [chart, setChart] = React.useState([]);

  return (
    <>
      <TableRow {...otherProps}>
        <TableCell>
          <IconButton
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (!isExpanded) {
                axios
                  .get(`/api/chart/${id}`)
                  .then((response) => {
                    setChart(response.data.data?.chart);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            }}
          >
            {isExpanded ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            )}
          </IconButton>
        </TableCell>
        {children}
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell />
          {expandComponent(chart)}
        </TableRow>
      )}
    </>
  );
};

const headCells = [
  {
    id: "_",
    disablePadding: false,
    label: "",
  },
  {
    id: "product",
    disablePadding: true,
    label: "Product",
  },
  {
    id: "#",
    disablePadding: false,
    label: "",
  },
  {
    id: "usd_price",
    sortable: true,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "monthly_sales",
    sortable: true,
    disablePadding: false,
    label: "Monthly Sales",
  },
  {
    id: "monthly_revenue",
    sortable: true,
    disablePadding: false,
    label: "Monthly Revenue",
  },
  {
    id: "store.products_count",
    sortable: true,
    disablePadding: false,
    label: "Store Info",
  },
];

function EnhancedTableHead(props) {
  const { orderBy, onRequestSort } = props;
  const createSortHandler = (v) => {
    onRequestSort(v);
  };

  const chf = (id) => Object.keys(orderBy).includes(id);
  const chv = (id) => orderBy[id];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={
              chf(headCell.id) ? (chv(headCell.id) ? "asc" : "desc") : false
            }
          >
            <TableSortLabel
              active={headCell.sortable}
              direction={
                chf(headCell.id)
                  ? chv(headCell.id) == -1
                    ? "asc"
                    : "desc"
                  : "asc"
              }
              onClick={() => {
                if (headCell.sortable)
                  createSortHandler({
                    [headCell.id]: chv(headCell.id) == 1 ? -1 : 1,
                  });
              }}
            >
              {headCell.label}
              {chf(headCell.id) ? (
                <Box component="span">{chv(headCell.id) === 1 ? "" : ""}</Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function Products() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.products);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const [breakdownOpen, setBreakdownOpen] = React.useState(false);
  const [breakdownPrice, setBreakdownPrice] = React.useState(0);
  const [data_, setData_] = React.useState([]);
  const [subPage, setSubPage] = React.useState(0);

  const handleScroll = useCallback(() => {
    const { scrollHeight, clientHeight, scrollTop } = document.documentElement;
    if (scrollHeight - scrollTop < clientHeight + 60) {
      if (subPage * 10 < rowsPerPage) {
        setSubPage(subPage + 1);
      }
    }
  }, [rowsPerPage, subPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, subPage]);

  useEffect(() => {
    setData_(data.products.slice(0, (subPage + 1) * 10));
  }, [subPage, data.products]);

  useEffect(() => {
    dispatch(loadParams());
  }, [dispatch]);

  useEffect(() => {
    if (data.inited) dispatch(getProducts(data.params));
    setSubPage(0);
  }, [data.params, data.inited, dispatch]);

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
              <Table>
                <EnhancedTableHead
                  orderBy={data.params.ordering}
                  onRequestSort={(value) => {
                    dispatch(
                      setParams({
                        ...data.params,
                        ordering: value,
                      })
                    );
                  }}
                />
                <TableBody>
                  {data_.map((row) => {
                    return (
                      <ExpandableTableRow
                        key={row.name}
                        id={row._id}
                        expandComponent={(chart) => {
                          const categories = [];
                          const series = [];
                          chart?.map((c) => {
                            categories.push(c.date);
                            series.push(c.value.toFixed(0));
                          });
                          return (
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
                          );
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              src={row.main_image}
                              variant="rounded"
                              sx={{
                                width: 68,
                                height: 68,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  textWrap: "balance",
                                  lineHeight: 1.2,
                                }}
                              >
                                {row.title}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <Link
                                  href={`https://${row.store?.original_domain}/products/${row.handle}`}
                                >
                                  {row.store.custom_domain}
                                </Link>
                                <Typography fontSize={12} color={"gray"}>
                                  {row.variants} Variants
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Link
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                            href={`https://www.aliexpress.com/wholesale?SearchText=${row.title}`}
                            target="_blank"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              class="icon aliexpress-icon"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M22 22.0527H2C1.46957 22.0527 0.960859 21.842 0.585787 21.4669C0.210714 21.0918 0 20.5831 0 20.0527V2C0 1.46957 0.210714 0.960859 0.585787 0.585787C0.960859 0.210714 1.46957 0 2 0H22C22.5304 0 23.0391 0.210714 23.4142 0.585787C23.7893 0.960859 24 1.46957 24 2V20.0527C24 20.5831 23.7893 21.0918 23.4142 21.4669C23.0391 21.842 22.5304 22.0527 22 22.0527Z"
                                fill="#FF9900"
                              ></path>
                              <path
                                d="M22 23.9999H2C1.46957 23.9999 0.960859 23.7892 0.585787 23.4141C0.210714 23.0391 0 22.5304 0 21.9999V5.33325C0 4.80282 0.210714 4.29411 0.585787 3.91904C0.960859 3.54397 1.46957 3.33325 2 3.33325H22C22.5304 3.33325 23.0391 3.54397 23.4142 3.91904C23.7893 4.29411 24 4.80282 24 5.33325V21.9999C24 22.5304 23.7893 23.0391 23.4142 23.4141C23.0391 23.7892 22.5304 23.9999 22 23.9999Z"
                                fill="#E62E04"
                              ></path>
                              <path
                                d="M6.0013 8.66667C6.73768 8.66667 7.33463 8.06971 7.33463 7.33333C7.33463 6.59695 6.73768 6 6.0013 6C5.26492 6 4.66797 6.59695 4.66797 7.33333C4.66797 8.06971 5.26492 8.66667 6.0013 8.66667Z"
                                fill="#F2F6FF"
                              ></path>
                              <path
                                d="M18.0013 8.66667C18.7377 8.66667 19.3346 8.06971 19.3346 7.33333C19.3346 6.59695 18.7377 6 18.0013 6C17.2649 6 16.668 6.59695 16.668 7.33333C16.668 8.06971 17.2649 8.66667 18.0013 8.66667Z"
                                fill="#F2F6FF"
                              ></path>
                              <path
                                d="M18 7.33325C18 10.6473 15.314 13.3333 12 13.3333C8.686 13.3333 6 10.6473 6 7.33325"
                                stroke="#FFFFFF"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                              ></path>
                            </svg>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            <Link
                              href={`#${row.id}`}
                              underline="none"
                              fontSize={14}
                              onClick={() => {
                                setBreakdownPrice(row.usd_price);
                                setBreakdownOpen(true);
                              }}
                            >
                              ${row.usd_price}
                              {row.usd_price_max
                                ? ` - ${row.usd_price_max}`
                                : null}
                            </Link>
                            <Typography fontSize={10} color={"grey"}>
                              {row.original_price}
                              {row.original_price_max
                                ? ` - ${row.original_price_max}`
                                : null}{" "}
                              &nbsp;
                              {row.store.currency}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{row.monthly_sales}</TableCell>
                        <TableCell>{`$${row.monthly_revenue}`}</TableCell>
                        <TableCell>
                          <Typography>{row.store.products_count}</Typography>
                        </TableCell>
                      </ExpandableTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Stack>
        </CardContent>
      </Card>
      <Dialog
        open={breakdownOpen}
        fullWidth
        maxWidth={"lg"}
        onClose={() => setBreakdownOpen(false)}
      >
        <DialogContent
          sx={{
            pt: 2,
            px: 4,
          }}
        >
          <Breakdown
            initPrice={breakdownPrice}
            handleClose={() => setBreakdownOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
