import { Box, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import FilterDialog from "./FilterDialog";
import { setParams } from "../../redux/nexus/nexusSlice";

export default function SearchBar({ disabled }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()
  const { params } = useSelector((state) => state.nexus);


  useEffect(() => {
    setQuery(params.q)
  }, [params])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "column", md: "row" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          disabled={disabled}
          placeholder="Search..."
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            style: {
              borderRadius: 0,
              height: 48,
            },
          }}
        />
        <Button
          variant="contained"
          disabled={disabled}
          endIcon={<SearchIcon />}
          onClick={() => dispatch(setParams({ ...params, q: query }))}
          sx={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            height: 48,
            px: 3,
          }}
        >
          Search
        </Button>
      </Box>

      <Button
        variant="outlined"
        size="small"
        disabled={disabled}
        endIcon={<FilterListIcon />}
        onClick={() => setOpen(true)}
        sx={{
          height: 48,
          px: 3,
        }}
      >
        More filters
      </Button>
      <FilterDialog
        open={open}
        onClose={() => setOpen(false)}
        setParams={(params) => dispatch(setParams(params))}
        params={params}
      />
    </Box>
  );
}
