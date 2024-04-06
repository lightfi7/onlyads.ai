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
          Name
        </Typography>
        <TextField
          variant="filled"
          sx={{
            maxWidth: "md",
          }}
          value={data?.name}
          onChange={(e) =>
            setData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Name"
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
          User ID
        </Typography>
        <TextField
          variant="filled"
          sx={{
            maxWidth: "md",
          }}
          value={data?.user_id}
          onChange={(e) =>
            setData((prev) => ({ ...prev, user_id: e.target.value }))
          }
          placeholder="User ID"
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
          Email
        </Typography>
        <TextField
          variant="filled"
          sx={{
            maxWidth: "md",
          }}
          value={data?.email}
          onChange={(e) =>
            setData((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Email"
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
