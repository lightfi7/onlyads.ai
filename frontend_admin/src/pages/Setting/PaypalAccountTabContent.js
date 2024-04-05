import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../services/axios";

const validationSchema = Yup.object().shape({
  apiKey: Yup.string().required("Required"),
});

export default function PaypalAccountTabContent({ apiKey, handleMessage }) {
  const formik = useFormik({
    initialValues: {
      apiKey: apiKey,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      /** */
      axios
        .post("/api/setting/paypal", values)
        .then((res) => {
          handleMessage({
            t: "Success!",
            s: "success",
          });
        })
        .catch((err) => {
          handleMessage({
            t: "Faild!",
            s: "warning",
          });
        });
    },
  });

  return (
    <Card
      sx={{ minWidth: 275 }}
      component="form"
      onSubmit={formik.handleSubmit}
      noValidate
    >
      <CardHeader subheader="" />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: 12,
                    sm: 14,
                  },
                }}
                color={"gray"}
              >
                API Key*
              </Typography>
              <TextField
                name="apiKey"
                fullWidth
                hiddenLabel
                defaultValue=""
                variant="filled"
                value={formik.values.apiKey}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.apiKey && Boolean(formik.errors.apiKey)}
                helperText={formik.touched.apiKey && formik.errors.apiKey}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
              }}
            ></Box>
          </Box>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          p: 2,
        }}
      >
        <Button variant="contained" size="large" type="submit">
          Save changes
        </Button>
      </CardActions>
    </Card>
  );
}
