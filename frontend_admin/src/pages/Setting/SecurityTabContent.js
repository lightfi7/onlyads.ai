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

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(6, (obj) => showErrors("Current Password", obj.value.length, obj.min))
    .required("Required"),
  newPassword: Yup.string()
    .min(6, (obj) => showErrors("New Password", obj.value.length, obj.min))
    .required("Required"),
  retypeNewPassword: Yup.string()
    .min(6, (obj) =>
      showErrors("Retype New Password", obj.value.length, obj.min)
    )
    .required("Required")
    .oneOf([Yup.ref(`newPassword`), null], "Passwords must match"),
});

export default function SecurityTabContent({ data, handleMessage }) {
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      retypeNewPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      /** */
      const userId = null;
      axios
        .post("/api/password/reset", Object.assign(values, { user: userId }))
        .then((res) => {
          handleMessage({
            t: "Success to reset your password!",
            s: "success",
          });
        })
        .catch((error) => {
          handleMessage({
            t: "Faild to reset your password!",
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
                Current Password*
              </Typography>
              <TextField
                name="currentPassword"
                fullWidth
                hiddenLabel
                defaultValue=""
                variant="filled"
                type="password"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.currentPassword &&
                  Boolean(formik.errors.currentPassword)
                }
                helperText={
                  formik.touched.currentPassword &&
                  formik.errors.currentPassword
                }
              />
            </Box>
            <Box
              sx={{
                width: "100%",
              }}
            ></Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              // flexDirection: "column",
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
                New Password*
              </Typography>
              <TextField
                name="newPassword"
                fullWidth
                hiddenLabel
                defaultValue=""
                variant="filled"
                type="password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.newPassword &&
                  Boolean(formik.errors.newPassword)
                }
                helperText={
                  formik.touched.newPassword && formik.errors.newPassword
                }
              />
            </Box>
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
                Retype New Password
              </Typography>
              <TextField
                name="retypeNewPassword"
                fullWidth
                hiddenLabel
                defaultValue=""
                variant="filled"
                type="password"
                value={formik.values.retypeNewPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.retypeNewPassword &&
                  Boolean(formik.errors.retypeNewPassword)
                }
                helperText={
                  formik.touched.retypeNewPassword &&
                  formik.errors.retypeNewPassword
                }
              />
            </Box>
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
