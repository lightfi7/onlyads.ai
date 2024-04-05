import {
  Box,
  LinearProgress,
  Typography,
  linearProgressClasses,
  styled,
} from "@mui/material";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

const Membership = ({ membership }) => {
  let starts_date = new Date(membership.issuedDate);
  let expires_date = new Date(membership.dueDate);

  let year = starts_date.getFullYear();
  let month = starts_date.getMonth() + 1;
  let day = starts_date.getDate();
  let starts_on = year + "-" + month + "-" + day;

  year = expires_date.getFullYear();
  month = expires_date.getMonth() + 1;
  day = expires_date.getDate();
  let expires_on = year + "-" + month + "-" + day;

  let totalSeconds = expires_date - starts_date;
  let availableSeconds = expires_date - new Date();
  const seconds = Math.floor(availableSeconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  let progress = (availableSeconds / totalSeconds) * 100;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontSize={18}>
            Plan is <strong>{membership.type}</strong>
          </Typography>
          <Typography variant="body2" color={"gray"}>
            {membership.description}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" fontSize={18}>
            Active until <strong>{expires_on}</strong>
          </Typography>
          <Typography variant="body2" color={"gray"}>
            The memberships starts from <strong>{starts_on}</strong>{" "}
          </Typography>
        </Box>
      </Box>
      <BorderLinearProgress variant="determinate" value={progress} />
      <Typography variant="body2" color={"gray"}>
        {days} days remaining until your plan requires update
      </Typography>
    </Box>
  );
};

export default Membership;
