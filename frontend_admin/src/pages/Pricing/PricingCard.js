import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function PricingCard({ data }) {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const checkItem = (item) => {
    const today = new Date();
    const n = user?.memberships.filter(
      (m) => m?.type == item.title && new Date(m?.dueDate) > today
    );
    return n.length > 0;
  };

  if(isLoading) return <></>

  
  return (
    <Box sx={{ minWidth: 370 }}>
      <Card
        variant="outlined"
        sx={{
          boxShadow: "0 0 16px rgba(0, 0, 0, 0.12)",
          borderWidth: data.popular ? 2 : 1,
          borderColor: data.popular ? "#7367f0" : "gray-200",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {data.popular ? (
              <Chip
                label="Popular"
                sx={{
                  backgroundColor: "rgba(115, 103, 240, 0.12) !important",
                  color: "#7367f0",
                }}
                size="small"
              />
            ) : (
              <></>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Typography variant="h5">{data.title}</Typography>
            <Typography>{data.subtitle}</Typography>
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
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            {data.planBenefits.map((item) => (
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                <Typography variant="subtitle1">{item}</Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              mx: 2,
              my: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              variant={data.popular ? "contained" : "outlined"}
              color={checkItem(data) ? "success" : "primary"}
              sx={{
                width: "100%",
              }}
              onClick={() => {
                if (!checkItem(data))
                  navigate("/payment", {
                    state: {
                      data,
                    },
                  });
              }}
            >
              {checkItem(data) ? "Your current plan" : "Upgrade"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
