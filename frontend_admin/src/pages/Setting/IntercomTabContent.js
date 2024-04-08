import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import axios from "../../services/axios";

export default function IntercomTabContent({ handleMessage }) {
  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get("/api/setting/intercom/get")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Intercom Setting
      </Typography>
      <Box
        sx={{
          py: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" fontSize={16} color={"gray"}>
          App ID
        </Typography>
        <TextField
          variant="filled"
          sx={{
            maxWidth: "md",
          }}
          value={data?.app_id}
          onChange={(e) =>
            setData((prev) => ({ ...prev, app_id: e.target.value }))
          }
          placeholder="App ID"
        />
      </Box>
      <Box
        sx={{
          py: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" fontSize={16} color={"gray"}>
          Intercom Secret Key
        </Typography>
        <TextField
          variant="filled"
          sx={{
            maxWidth: "md",
          }}
          value={data?.intercom_secret_key}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              intercom_secret_key: e.target.value,
            }))
          }
          placeholder="Intercom Secret Key"
        />
      </Box>
      <Divider sx={{ my: 3 }} />
      <Button
        variant="contained"
        size="large"
        onClick={() => {
          axios
            .post("/api/setting/intercom/save", data)
            .then((response) => {
              handleMessage({
                t: "Success to updated your profile!",
                s: "success",
              });
            })
            .catch((error) => {
              handleMessage({
                t: "Failed to update your profile!",
                s: "warning",
              });
            });
        }}
      >
        Save Setting
      </Button>
    </Box>
  );
}
