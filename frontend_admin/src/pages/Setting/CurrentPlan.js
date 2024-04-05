import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import React from "react";
import Membership from "./Membership";

export default function CurrentPlan({ memberships }) {
  return (
    <Card>
      <CardHeader title="Current Plan" />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {memberships.map((membership, key) => {
            return <Membership key={key} membership={membership} />;
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
