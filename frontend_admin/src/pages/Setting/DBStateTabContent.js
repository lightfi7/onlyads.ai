import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import axios from "../../services/axios";
import React, { useEffect, useState } from "react";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import dayjs from "dayjs";

export default function DBStateTabContent() {
  const [engineStatus, setengineStatus] = useState(null);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    axios
      .post("/api/setting/status")
      .then((res) => {
        setengineStatus(res.data.status);
      })
      .catch((err) => {});
  }, []);

  const handleBackup = () => {
    setProgress(true);
    axios
      .get("/api/setting/backup", {
        responseType: "arraybuffer",
        onDownloadProgress: (progressEvent) => {},
      })
      .then((res) => {
        setProgress(false);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "backup.zip");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {});
  };

  return (
    <Box>
      <Typography variant="h5">Scraping Engine</Typography>
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 3, md: 4, lg: 5 },
        }}
      >
        <Badge
          color={
            engineStatus && engineStatus.ads?.running ? "primary" : "disabled"
          }
          badgeContent=""
        >
          <Paper
            elevation={6}
            sx={{
              width: { xs: 120, sm: 140, md: 200 },
              height: { xs: 120, sm: 140, md: 200 },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">ADS</Typography>
              <Typography fontSize={12} variant="subtitle">
                {engineStatus &&
                  dayjs(`${engineStatus.ads?.updatedAt}`).format(
                    "YYYY/MM/DD HH:mm:ss"
                  )}
              </Typography>
            </Box>
            {engineStatus && engineStatus.ads?.running && (
              <CircularProgress
                size={80}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-40px",
                  marginLeft: "-40px",
                }}
              />
            )}
          </Paper>
        </Badge>{" "}
        <Badge
          color={
            engineStatus && engineStatus.product?.running
              ? "primary"
              : "disabled"
          }
          badgeContent=""
        >
          <Paper
            elevation={6}
            sx={{
              width: { xs: 120, sm: 140, md: 200 },
              height: { xs: 120, sm: 140, md: 200 },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Products</Typography>
              <Typography fontSize={12} variant="subtitle">
                {engineStatus &&
                  dayjs(`${engineStatus.product?.updatedAt}`).format(
                    "YYYY/MM/DD HH:mm:ss"
                  )}
              </Typography>
            </Box>
            {engineStatus && engineStatus.product?.running && (
              <CircularProgress
                size={80}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-40px",
                  marginLeft: "-40px",
                }}
              />
            )}
          </Paper>
        </Badge>{" "}
        <Badge
          color={
            engineStatus && engineStatus.topproduct?.running
              ? "primary"
              : "disabled"
          }
          badgeContent=""
        >
          <Paper
            elevation={6}
            sx={{
              width: { xs: 120, sm: 140, md: 200 },
              height: { xs: 120, sm: 140, md: 200 },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Top Products</Typography>
              <Typography fontSize={12} variant="subtitle">
                {engineStatus &&
                  dayjs(`${engineStatus.topproduct?.updatedAt}`).format(
                    "YYYY/MM/DD HH:mm:ss"
                  )}
              </Typography>
            </Box>
            {engineStatus && engineStatus.topproduct?.running && (
              <CircularProgress
                size={80}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-40px",
                  marginLeft: "-40px",
                }}
              />
            )}
          </Paper>
        </Badge>{" "}
        <Badge
          color={
            engineStatus && engineStatus.topstore?.running
              ? "primary"
              : "disabled"
          }
          badgeContent=""
        >
          <Paper
            elevation={6}
            sx={{
              width: { xs: 120, sm: 140, md: 200 },
              height: { xs: 120, sm: 140, md: 200 },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Top Stores</Typography>
              <Typography fontSize={12} variant="subtitle">
                {engineStatus &&
                  dayjs(`${engineStatus.topstore?.updatedAt}`).format(
                    "YYYY/MM/DD HH:mm:ss"
                  )}
              </Typography>
            </Box>
            {engineStatus && engineStatus.topstore?.running && (
              <CircularProgress
                size={80}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-40px",
                  marginLeft: "-40px",
                }}
              />
            )}
          </Paper>
        </Badge>{" "}
      </Box>
      <Divider
        sx={{
          my: 3,
        }}
      />
      <Box
        sx={{
          px: 4,
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            position: "relative",
          }}
        >
          <Button
            onClick={handleBackup}
            disabled={progress}
            variant="contained"
            size="large"
            color="primary"
          >
            <ReportProblemIcon />
            Backup
          </Button>
          {progress && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
