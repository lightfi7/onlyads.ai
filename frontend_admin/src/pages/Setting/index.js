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
import PaymentIcon from "@mui/icons-material/Payment";
import RocketIcon from "@mui/icons-material/Rocket";
import AccountTabContent from "./AccountTabContent";
import SecurityTabContent from "./SecurityTabContent";
import PaypalAccountTabContent from "./PaypalAccountTabContent";
import axios from "../../services/axios";
import { useAuth } from "../../hooks/useAuth";
import BillingTabContent from "./BillingTabContent";
import DBStateTabContent from "./DBStateTabContent";
import StorageIcon from "@mui/icons-material/Storage";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import IntercomTabContent from "./IntercomTabContent";

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
  const [apiKey, setApiKey] = React.useState("");
  const [message, setMessage] = React.useState(null);

  React.useEffect(() => {
    axios
      .post("/api/setting/paypal/get", { id: user?._id })
      .then((response) => setApiKey(response.data.apiKey));
  }, [user?._id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (isLoading) return <></>;

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
          {user?.role === "admin" && (
            <Tab
              icon={<PaymentIcon />}
              iconPosition="start"
              label="Paypal"
              {...a11yProps(3)}
            />
          )}
          {user?.role === "admin" && (
            <Tab
              icon={<StorageIcon />}
              iconPosition="start"
              label="Database"
              {...a11yProps(4)}
            />
          )}

          {user?.role === "admin" && (
            <Tab
              icon={<PersonOutlineIcon />}
              iconPosition="start"
              label="Intercom account"
              {...a11yProps(5)}
            />
          )}
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
      {user?.role === "admin" && (
        <CustomTabPanel value={value} index={3}>
          <PaypalAccountTabContent apiKey={apiKey} handleMessage={setMessage} />
        </CustomTabPanel>
      )}
      {user?.role === "admin" && (
        <CustomTabPanel value={value} index={4}>
          <DBStateTabContent handleMessage={setMessage} />
        </CustomTabPanel>
      )}
      {user?.role === "admin" && (
        <CustomTabPanel value={value} index={5}>
          <IntercomTabContent handleMessage={setMessage} />
        </CustomTabPanel>
      )}
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
