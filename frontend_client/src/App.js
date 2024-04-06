import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  StyledEngineProvider,
  Backdrop,
  CircularProgress,
} from "@mui/material";

import Routes from "./routes";

import NavigationScroll from "./components/NavigationScroll";
import { AuthProvider } from "./contexts/authContext";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { getColor } from "./redux/theme/themeSlice";

function App() {
  const { color, loading } = useSelector((state) => state.theme);

  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getColor());
  }, [dispatch]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: color,
        },
        status: {},
      }),
    [color]
  );

  if (loading)
    return (
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "rgba(0, 0, 0, 0.1)",
        }}
        open={loading}
      >
        <CircularProgress color="inherit" size={96} />
      </Backdrop>
    );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavigationScroll>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
