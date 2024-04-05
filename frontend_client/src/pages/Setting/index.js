import {
  Alert,
  Box,
  Slide,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import * as React from "react";
import PropTypes from "prop-types";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShieldIcon from "@mui/icons-material/Shield";
import RocketIcon from "@mui/icons-material/Rocket";
import AccountTabContent from "./AccountTabContent";
import SecurityTabContent from "./SecurityTabContent";
import { useAuth } from "../../hooks/useAuth";
import BillingTabContent from "./BillingTabContent";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Setting() {
  const { user, isLoading } = useAuth();
  const [value, setValue] = React.useState(0);
  const [message, setMessage] = React.useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if(isLoading) return <></>

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="Setting Tabs">
          <Tab
            icon={<AccountCircleIcon />}
            iconPosition="start"
            label="Account"
            {...a11yProps(0)}
          />
          <Tab
            icon={<ShieldIcon />}
            iconPosition="start"
            label="Security"
            {...a11yProps(1)}
          />
          <Tab
            icon={<RocketIcon />}
            iconPosition="start"
            label="Billing & Plans"
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AccountTabContent data={user} handleMessage={setMessage} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SecurityTabContent handleMessage={setMessage} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <BillingTabContent data={user} handleMessage={setMessage} />
      </CustomTabPanel>
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
    </Box>
  );
}
