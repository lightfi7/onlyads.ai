import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box, Slider, Stack } from "@mui/material";

export default function CustomRangeSelect({
  disabled,
  value,
  handleChange,
  placeHolder,
  min = 0,
  max = 0,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [_value, setValue] = React.useState(
    value && value.length ? value : [min, max]
  );
  const [text, setText] = React.useState(placeHolder);
  const [timer, setTimer] = React.useState(null);

  React.useEffect(() => {
    if (!value || value.length == 0) return;
    if (value[0] !== min && value[1] !== max) {
      setText("From " + value[0] + " to " + value[1]);
    } else if (value[0] == min && value[1] == max) {
      setText(placeHolder);
    } else if (value[0] == min) {
      setText("Less than " + value[1]);
    } else {
      setText("More than " + value[0]);
    }
  }, [value]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const _handleChange = (event, newValue) => {
    setValue(newValue);

    if (newValue[0] !== min && newValue[1] !== max) {
      setText("From " + newValue[0] + " to " + newValue[1]);
    } else if (newValue[0] == min && newValue[1] == max) {
      setText(placeHolder);
    } else if (newValue[0] == min) {
      setText("Less than " + newValue[1]);
    } else {
      setText("More than " + newValue[0]);
    }

    clearTimeout(timer);

    setTimer(
      setTimeout(() => {
        if (handleChange) handleChange(newValue);
      }, 300)
    );
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Button
        disabled={disabled}
        aria-describedby={id}
        sx={{
          minWidth: 180,
        }}
        variant="outlined"
        onClick={handleClick}
      >
        {text}
      </Button>
      <Popover
        disabled={disabled}
        id={id}
        sx={{
          mt: 1,
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Stack
          // onMouseLeave={() => setAnchorEl(null)}
          sx={{
            mx: 3,
            my: 2,
          }}
          direction="column"
        >
          <Typography variant="h8">{text}</Typography>
          <Slider
            disabled={disabled}
            sx={{
              width: 300,
            }}
            min={min}
            max={max}
            getAriaLabel={() => "Temperature range"}
            value={_value}
            onChange={_handleChange}
          />
        </Stack>
      </Popover>
    </div>
  );
}
