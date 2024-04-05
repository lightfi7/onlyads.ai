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
import { useAuth } from "../../hooks/useAuth";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Not valid email").required("Required"),
});

export default function AccountTabContent({ data, handleMessage }) {
  const { setUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: data.userName,
      email: data.email,
      phone: data.phoneNumber,
      address: data.address,
      state: data.state,
      zipCode: data.zipCode,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios
        .post("/api/profile/update", values)
        .then((res) => {
          setUser(res.data.user);
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
                Name*
              </Typography>
              <TextField
                name="name"
                fullWidth
                hiddenLabel
                defaultValue=""
                variant="filled"
                placeholder="John Doe"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
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
                Email*
              </Typography>
              <TextField
                name="email"
                fullWidth
                hiddenLabel
                defaultValue=""
                variant="filled"
                disabled
                placeholder="admin@example.com"
                value={formik.values.email}
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                // error={formik.touched.email && Boolean(formik.errors.email)}
                // helperText={formik.touched.email && formik.errors.email}
              />
            </Box>
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
                Phone
              </Typography>
              <TextField
                name="phone"
                fullWidth
                hiddenLabel
                defaultValue=""
                variant="filled"
                placeholder="+1234 567 8900"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                Address
              </Typography>
              <TextField
                name="address"
                fullWidth
                hiddenLabel
                defaultValue=""
                variant="filled"
                placeholder=""
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Box>
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
                State
              </Typography>
              <TextField
                name="state"
                fullWidth
                hiddenLabel
                defaultValue=""
                variant="filled"
                placeholder="New York"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                Zip Code
              </Typography>
              <TextField
                name="zipCode"
                fullWidth
                hiddenLabel
                defaultValue=""
                variant="filled"
                placeholder=""
                value={formik.values.zipCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
