import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { Container } from "@mui/material";
import axios from "../services/axios";

export default function MainLayout() {
  const addIntercomScript = React.useCallback(() => {
    axios
      .get("/api/setting/intercom/get")
      .then((response) => {
        const script = document.createElement("script");
        script.src = `/intercom.js?app_id=${response.data.app_id}&name=${response.data.name}&user_id=${response.data.user_id}&email=${response.data.email}`;
        document.body.appendChild(script);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  React.useEffect(() => {
    addIntercomScript();
  }, [addIntercomScript]);

  return (
    <div>
      <Header />
      <Container
        maxWidth="xl"
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
