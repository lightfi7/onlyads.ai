import { Avatar, Box, Button, Paper, Typography } from "@mui/material";
import React, { useState } from "react";

export default function ProductCard({ data, handleResearch }) {
  const [showProductResearch, setShowProductResearch] = useState(false);
  return (
    <Paper
      elevation={1}
      sx={{
        position: "relative",
        border: 1,
        borderColor: "divider",
        boxShadow: "none",
        height: "100%",
      }}
    >
      <Box
        onMouseEnter={() => setShowProductResearch(true)}
        onMouseLeave={() => setShowProductResearch(false)}
      >
        <Avatar
          variant="square"
          sx={{
            width: "100%",
            height: 240,
            borderRadius: 1,
            cursor: "pointer",
            ":hover": {
              filter: "blur(1px)",
              transition: "1s",
            },
          }}
          src={data?.imageURL}
          onClick={() => handleResearch(data)}
        />
        <Box sx={{ p: 1, px: 2 }}>
          <Typography
            variant="h6"
            fontSize={18}
            sx={{
              mb: 3,
              minHeight: 100,
            }}
          >
            {data?.productName?.length > 60
              ? `${data?.productName?.slice(0, 60)}...`
              : data?.productName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" fontSize={18} color={"#ed106f!important"}>
              ${data?.productPrice}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h6" fontSize={16} color={"gray"}>
                  Orders
                </Typography>
                <Typography variant="h6" fontSize={18}>
                  {data?.productOrders}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontSize={16} color={"gray"}>
                  Sales
                </Typography>
                <Typography variant="h6" fontSize={18}>
                  {data?.productSales}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        {showProductResearch && (
          <Box
            sx={{
              bgcolor: "#fff",
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              width: "100%",
              height: 60,
              bottom: 0,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => handleResearch(data)}
              sx={{
                borderTopRightRadius: 0,
                borderTopLeftRadius: 0,
                fontSize: 16,
              }}
            >
              Product Research
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
