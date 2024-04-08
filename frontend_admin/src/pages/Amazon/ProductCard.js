import {
  Avatar,
  Box,
  Button,
  Paper,
  Typography,
  Rating,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import ShowChartIcon from "@mui/icons-material/ShowChart";

export default function ProductCard({ data, handleTrendChart }) {
  const [showBottomBar, setShowBottomBar] = useState(false);

  const getProductRating = (str) => {
    try {
      let a = str.replace("(", "").replace(")", "").split(" "),
        r = a.length ? a[0] : 0;
      return parseFloat(r);
    } catch (err) {
      return 0;
    }
  };

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
        onMouseEnter={() => setShowBottomBar(true)}
        onMouseLeave={() => setShowBottomBar(false)}
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
          onClick={() => handleTrendChart(data)}
        />
        <Box sx={{ p: 1, px: 2 }}>
          <Typography
            variant="h6"
            fontSize={18}
            sx={{
              mb: 2,
              minHeight: 60,
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Rating value={getProductRating(data?.productRating)} />
              <Typography variant="body">{data?.productRating}</Typography>
            </Box>
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
                  Price
                </Typography>
                <Typography variant="h6" fontSize={18}>
                  {data?.productPrice}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontSize={16} color={"gray"}>
                  Ranking
                </Typography>
                <Typography variant="h6" fontSize={18}>
                  {data?.productOrdersRanking}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Typography variant="h6" fontSize={16} color={"gray"}>
                    Daily:
                  </Typography>
                  <Typography variant="h6" fontSize={16}>
                    {data?.productDaily}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Typography variant="h6" fontSize={16}>
                    {data?.productDailyRank}
                  </Typography>
                  <Typography variant="h6" fontSize={16} color={"gray"}>
                    Rank_Main
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Typography variant="h6" fontSize={16} color={"gray"}>
                    Overall:
                  </Typography>
                  <Typography variant="h6" fontSize={16}>
                    {data?.productOverall}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Typography variant="h6" fontSize={16}>
                    {data?.productOverallRank}
                  </Typography>
                  <Typography variant="h6" fontSize={16} color={"gray"}>
                    Rank_Main
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {showBottomBar && (
          <Box
            sx={{
              bgcolor: "#fff",
              position: "absolute",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              px: 2,
              alignItems: "center",
              gap: 3,
              width: "100%",
              height: 60,
              bottom: 0,
            }}
          >
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => {
                handleTrendChart(data);
              }}
              startIcon={<ShowChartIcon />}
            >
              Chart
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <IconButton
                href={data?.productLink}
                target="_blank"
                sx={{
                  borderRadius: 1,
                  border: "1px solid #faaf00",
                }}
              >
                <img
                  src="/imgs/amazon.png"
                  width={24}
                  height={24}
                  alt="amazon"
                />
              </IconButton>
              <IconButton
                href={data?.productAliexpressLink}
                target="_blank"
                sx={{
                  borderRadius: 1,
                  border: "1px solid #ed106f",
                }}
              >
                <img
                  src="/imgs/ali.png"
                  width={24}
                  height={24}
                  alt="aliexpress"
                />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
