import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Box,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import {
  clearProductsByStore,
  getProducts5ByStore,
  getProductsByStore,
} from "../../redux/sales/topStoreSlice";
import { useDispatch, useSelector } from "react-redux";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const headCells = [
  {
    id: "product",
    disablePadding: false,
    label: "Product",
  },
  {
    id: "createdDate",
    sortable: true,
    disablePadding: false,
    label: "Product Creation Date",
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

export default function ProductList({ storeId, open, handleClose }) {
  const dispatch = useDispatch();
  const { data, total, loading } = useSelector(
    (state) => state.topstores.products
  );
  const [page, setPage] = React.useState(0);
  const [sort, setSort] = React.useState({
    createdDate: 1,
  });

  const getData = React.useCallback(() => {
    dispatch(
      getProductsByStore({
        storeId,
        page_num: page,
        page_count: 10,
        sort,
      })
    );
  }, [dispatch, page, sort, storeId]);

  const getData5 = React.useCallback(() => {
    dispatch(
      getProducts5ByStore({
        storeId,
        page_num: page,
        page_count: 10,
        sort,
      })
    );
  }, [dispatch, page, sort, storeId]);

  React.useEffect(() => {
    if (!open) return;
    if (storeId) {
      if (page === 0) getData();
      else {
        getData5();
      }
    }
  }, [storeId, page, open, sort, getData, getData5]);

  const scrollRef = React.useRef(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
      if (scrollHeight - scrollTop < clientHeight + 60) {
        if (data.length < total && !loading) setPage(page + 1);
      }
    }
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        maxWidth="xl"
        fullWidth
        onClose={() => {
          dispatch(clearProductsByStore());
          setPage(0);
          handleClose();
        }}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Products
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            dispatch(clearProductsByStore());
            setPage(0);
            handleClose();
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
        {loading && <LinearProgress />}
        <DialogContent
          dividers
          ref={scrollRef}
          onScroll={handleScroll}
          sx={{
            p: 0,
            overflowY: "scroll",
            width: "100%",
            minHeight: 360,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 0.2,
              height: "100%",
              flexDirection: "column",
            }}
          >
            <Table stickyHeader>
              <EnhancedTableHead
                orderBy={sort}
                onRequestSort={(value) => {
                  setSort(value);
                }}
              />
              <TableBody>
                {data.map((p, key) => {
                  return (
                    <TableRow>
                      <TableCell component="th" scope="row">
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
                              <Typography variant="subtitle2" color={"gray"}>
                                {p.variants} Variants
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Stack
                          sx={{
                            flex: 1,
                          }}
                          spacing={1}
                          direction={"row"}
                        >
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
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Button
                          variant="outlined"
                          href={`https://${p.store.original_domain}/products/${p.handle}`}
                          target="_blank"
                        >
                          View Product
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
