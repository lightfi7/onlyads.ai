import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import PricingCard from "./PricingCard";

const pricingData = [
  {
    title: "Basic",
    subtitle: "A simple start for everyone",
    monthlyPrice: 77,
    planBenefits: [
      "200 ads per query",
      "50 ad details per day",
      "50 product details per day",
      "50 advertiser per query",
      "50 advertiser details per day",
      "Unlimited Winning Product",
    ],
    popular: false,
  },
  {
    title: "Standard",
    subtitle: "For small to medium businesses",
    monthlyPrice: 155,
    planBenefits: [
      "2000 ads per query",
      "200 ad details per day",
      "200 product details per day",
      "2000 advertiser per query",
      "200 advertiser details per day",
      "Unlimited Winning Product",
    ],
    popular: true,
  },
  {
    title: "Enterprise",
    subtitle: "Solution for big organizations",
    monthlyPrice: 263,
    planBenefits: [
      "Unlimited ads per query",
      "Unlimited ad details per day",
      "Unlimited product details per day",
      "Unlimited advertiser per query",
      "Unlimited advertiser details per day",
      "Unlimited Winning Product",
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <Box>
      <Stack direction={"column"}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4">Pricing Plans</Typography>
          <Typography variant="subtitle1">
            Choose your best plan, and the subscription will automatically renew
            every month (after trial period) before you unsubscribe.
          </Typography>
        </Box>
        <Box
          sx={{
            m: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          {pricingData.map((d) => {
            return <PricingCard data={d} />;
          })}
        </Box>
      </Stack>
    </Box>
  );
}
