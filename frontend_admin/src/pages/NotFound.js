import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { purple } from "@mui/material/colors";

const primary = purple[500]; // #f44336

export default function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h1" style={{}}>
        404
      </Typography>
      <Typography variant="h6" style={{}}>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button
        sx={{
          mt: 4,
        }}
        href="/"
      >
        Back
      </Button>
    </Box>
  );
}
