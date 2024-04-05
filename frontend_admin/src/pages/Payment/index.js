import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Paypal from "./Paypal";
import { Alert, Box, Slide, Snackbar, Typography } from "@mui/material";
import axios from "../../services/axios";

export default function Payment() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data;
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paypalKey, setPaypalKey] = useState("");

  useEffect(() => {
    axios
      .post("/api/setting/paypal/get", { id: user?._id })
      .then((response) => {
        console.log(response.data.apiKey);
        setPaypalKey(response.data.apiKey);
      })
      .catch((err) => console.log(err));
  }, []);

  const approved = () => {
    const userId = user?._id;
    const membershipType = data?.title;
    const membershipDescription = data?.subtitle;
    const amount = data?.monthlyPrice;

    axios
      .post("/api/memberships/createByPayment", {
        userId,
        membershipType,
        membershipDescription,
        amount,
      })
      .then((response) => {
        setSuccess(true);
        const message = {
          s: "success",
          t: "Your payment has been successfully completed.",
        };
        setMessage(message);
        setTimeout(() => {
          navigate("/");
          setMessage(null);
        }, 3000);
      })
      .catch((err) => {
        const message = {
          s: "warning",
          t: "Something went wrong, please try again.",
        };
        setMessage(message);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      });
  };

  if(isLoading) return <></>

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box></Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Typography variant="h4">{data.title}</Typography>
          <Typography variant="h6">{data.subtitle}</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <sup
              style={{
                fontSize: 30,
                fontWeight: 500,
              }}
            >
              $
            </sup>
            <Typography variant="h2">{data.monthlyPrice}</Typography>
            <span
              style={{
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              / month
            </span>
          </Box>
        </Box>
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              minWidth: 370,
            }}
          >
            {!success && paypalKey && (
              <Paypal
                amount={100}
                approved={approved}
                apiKey={paypalKey}
                onMessage={(msg) => {
                  setMessage(msg);
                  setTimeout(() => setMessage(null), 3000);
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={message != null}
        onClose={() => setMessage(null)}
        TransitionComponent={(props) => <Slide direction="up" {...props} />}
        autoHideDuration={3000}
      >
        <Alert
          onClose={() => setMessage(null)}
          severity={message?.s}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message?.t}
        </Alert>
      </Snackbar>
    </div>
  );
}
