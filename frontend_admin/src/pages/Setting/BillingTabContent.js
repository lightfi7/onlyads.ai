import React from "react";
import CurrentPlan from "./CurrentPlan";
import { Box } from "@mui/material";
import InvoiceList from "./InvoiceList";

export default function BillingTabContent({ data }) {
  const { memberships, invoices } = data;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CurrentPlan memberships={memberships} />
      <InvoiceList invoices = {invoices} />
    </Box>
  );
}
