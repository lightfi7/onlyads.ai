import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUser } from "../../redux/users/usersSlice";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import InvoiceList from "../Setting/InvoiceList";
import MembershipList from "./MembershipList";
import { addPlan } from "../../redux/plans/planSlice";

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
      "1000 advertiser per query",
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
      "5000 ads per query",
      "1000 ad details per day",
      "1000 product details per day",
      "3000 advertiser per query",
      "1000 advertiser details per day",
      "Unlimited Winning Product",
    ],
    popular: false,
  },
];

export default function UserDetails() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.selectedUser);
  const [membership, setMembership] = useState(pricingData[0]);

  const { id } = useParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getUser(id));
  }, [dispatch, id]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeMembership = (event) => {
    setMembership(event.target.value);
  };

  const handleAddMembership = () => {
    let membershipType = membership.title;
    let amount = membership.monthlyPrice;
    let description = membership.subtitle;
    dispatch(addPlan({ id, membershipType, amount, description }));
  };

  if (!user) return null;
  else
    return (
      <>
        <Grid container spacing={3}>
          <Grid item lg={4} sm={12}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                  }}
                >
                  <Avatar sx={{ width: 96, height: 96 }} />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h6">{user.userName}</Typography>
                    <Chip label={user.role} color="primary" size="small" />
                  </Box>
                </Box>
                <Divider sx={{ m: 2 }}>
                  <Typography variant="body1" fontSize={14}>
                    DETAILS
                  </Typography>
                </Divider>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    px: 3,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        minWidth: 100,
                      }}
                      color={"gray"}
                    >
                      Name
                    </Typography>
                    <Typography variant="body1">{user.userName}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        minWidth: 100,
                      }}
                      color={"gray"}
                    >
                      Email
                    </Typography>
                    <Typography variant="body1">{user.email}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        minWidth: 100,
                      }}
                      color={"gray"}
                    >
                      Phone{" "}
                    </Typography>
                    <Typography variant="body1">{user.phone}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        minWidth: 100,
                      }}
                      color={"gray"}
                    >
                      Address
                    </Typography>
                    <Typography variant="body1">{user.address}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        minWidth: 100,
                      }}
                      color={"gray"}
                    >
                      State
                    </Typography>
                    <Typography variant="body1">{user.state}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        minWidth: 100,
                      }}
                      color={"gray"}
                    >
                      ZipCode
                    </Typography>
                    <Typography variant="body1">{user.zipCode}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ my: 4 }}>
              <CardContent>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Add membership
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={8} sm={12}>
            <Card
              sx={{
                mb: 4,
              }}
            >
              <CardContent>
                <MembershipList userId={user._id} />
              </CardContent>
            </Card>
            <InvoiceList invoices={user.invoices} />
          </Grid>
        </Grid>
        <Dialog
          fullWidth
          maxWidth="sm"
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
              handleClose();
            },
          }}
        >
          <DialogTitle>Add Membership</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Choose the best plan for user.
            </DialogContentText>
            <FormControl
              fullWidth
              sx={{
                my: 2,
              }}
            >
              <InputLabel>Membership</InputLabel>
              <Select
                value={membership}
                onChange={handleChangeMembership}
                label="Membership"
              >
                {pricingData.map((d) => {
                  return (
                    <MenuItem
                      value={d}
                    >{`${d.title} - $${d.monthlyPrice}/month`}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleAddMembership}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
}
