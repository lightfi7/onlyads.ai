import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../../services/axios";

const headCells = [
  {
    id: "#@",
    disablePadding: true,
    label: "",
  },
  {
    id: "title",
    disablePadding: true,
    label: "Title",
  },
  {
    id: "productMinPrice_Converted",
    sortable: true,
    disablePadding: false,
    label: "Cost",
  },
  {
    id: "freightAmount_Converted",
    sortable: true,
    disablePadding: false,
    label: "Shipping",
  },
  {
    id: "deliveryDateFormat",
    sortable: true,
    disablePadding: false,
    label: "Delivery Date",
  },
  {
    id: "totalOrders",
    sortable: true,
    disablePadding: false,
    label: "Orders",
  },
  {
    id: "averageRating",
    sortable: true,
    disablePadding: false,
    label: "Rating",
  },
  {
    id: "#",
    disablePadding: false,
    label: "",
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
              chf(headCell.id) ? (chv(headCell.id) ? "asc" : false) : false
            }
          >
            <TableSortLabel
              active={headCell.sortable && chv(headCell.id)}
              direction={"asc"}
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
export default function AISupplierList(props) {
  const { productId } = props;
  const [products, setProducts] = React.useState([]);
  const [filterProducts, setFilterProducts] = React.useState([]);
  const [shippingMethods, setShippingMethods] = React.useState([]);
  const [companies, setCompanies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState({});

  React.useEffect(() => {
    setLoading(true);
    axios
      .post("/api/nexus/getSuppliers", {
        productId: productId,
      })
      .then((response) => {
        setProducts(response.data?.products);
        setFilterProducts(response.data?.products);
        setShippingMethods(response.data?.shipping_methods);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [productId]);

  React.useEffect(() => {
    if (companies.length === 0) setFilterProducts(products);
    else
      setFilterProducts(
        products.filter((p) =>
          companies.map((i) => i.company).includes(p.company)
        )
      );
  }, [products, companies]);

  React.useEffect(() => {
    let keys = Object.keys(orderBy);
    if (keys.length) {
      let key = keys[0];
      setFilterProducts(
        products.sort((a, b) => {
          switch (key) {
            case "productMinPrice_Converted":
              return a.productMinPrice.value - b.productMinPrice.value;
            case "freightAmount_Converted":
              return a.freightAmount.value - b.freightAmount.value;
            case "deliveryDateFormat":
              return Number(a.deliveryDate) - Number(b.deliveryDate);
            case "totalOrders":
              return Number(a.totalOrders) - Number(b.totalOrders);
            case "averageRating":
              return Number(a.averageRating) - Number(b.averageRating);
            default:
              return 1;
          }
        })
      );
    }
  }, [orderBy, products]);

  return (
    <Dialog fullWidth maxWidth="lg" open={props?.open} onClose={props?.onClose}>
      <DialogTitle>AISupplierList</DialogTitle>
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
        {!loading ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Autocomplete
                size="small"
                multiple
                sx={{
                  minWidth: 320,
                }}
                options={shippingMethods}
                getOptionLabel={(option) => option.companyDisplayName}
                onChange={(e, value) => {
                  setCompanies(value);
                }}
                value={companies}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField {...params} label="" placeholder="Companies" />
                )}
              />
            </Box>
            <Table>
              <EnhancedTableHead
                orderBy={orderBy}
                onRequestSort={(value) => {
                  setOrderBy(value);
                }}
              />
              <TableBody>
                {filterProducts.length !== 0 ? (
                  filterProducts.map((product, i) => (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">
                        <Avatar
                          src={product.imageUrl}
                          variant="square"
                          sx={{
                            display: { xs: "none", sm: "block" },
                            width: 120,
                            height: 120,
                            borderRadius: 2,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography
                          variant="h6"
                          fontSize={{ xs: 14, sm: 16, lg: 18 }}
                        >
                          {product.title}
                        </Typography>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {product.productMinPrice_Converted}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {product.freightAmount_Converted}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {product.deliveryDateFormat}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {product.totalOrders}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {product.averageRating}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                          }}
                        >
                          <Button
                            variant="outlined"
                            sx={{
                              p: 1,
                              minWidth: 0,
                            }}
                            target="_blank"
                            href={`https://www.aliexpress.us/item/${product.buttons_data.replace(
                              ",0",
                              ""
                            )}.html`}
                          >
                            <ShoppingBagIcon color="primary" />
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      scope="row"
                      colSpan={8}
                      sx={{
                        py: 3,
                      }}
                    >
                      <Typography
                        variant="h6"
                        textAlign={"center"}
                        sx={{
                          minHeight: 150,
                        }}
                      >
                        No data found...
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        ) : (
          <Box sx={{ minHeight: 480, position: "relative" }}>
            <CircularProgress
              size={90}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-45px",
                marginLeft: "-45px",
              }}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
