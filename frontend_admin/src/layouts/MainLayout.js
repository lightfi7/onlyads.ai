import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { Container } from "@mui/material";

export default function MainLayout() {
  return (
    <div>
      <Header />
      <Container
        maxWidth={"xl"}
        sx={{
          mt: 12,
        }}
      >
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}
