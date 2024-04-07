import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { Container } from "@mui/material";
import axios from "../services/axios";
import { useAuth } from "../hooks/useAuth";
import { v4 as uuidv4, v5 as uuidv5 } from "uuid";

export default function MainLayout() {
  const { user, isLoading } = useAuth();
  const addIntercomScript = React.useCallback(() => {
    axios
      .get("/api/setting/intercom/get")
      .then((response) => {
        const v4Id = uuidv4();
        const script = document.createElement("script");
        script.src = `/intercom.js?app_id=${response.data.app_id}&name=${user.userName}&user_id=${v4Id}&email=${user.email}`;
        document.body.appendChild(script);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  React.useEffect(() => {
    if (!isLoading) addIntercomScript();
  }, [addIntercomScript, isLoading, user]);

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
