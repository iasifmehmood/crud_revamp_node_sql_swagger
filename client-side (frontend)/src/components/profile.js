import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";

export default function Profile() {
  let navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      let response = await axios.get("http://localhost:4000/logout"); //, logout
      swal(response.data.message);
      navigate("/login"); // to navigate to profile
      //   console.log(response.data.message);
    } catch (error) {
      swal(error.response.data.message);
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome
          </Typography>
          <Button onClick={handleSubmit} color="inherit">
            logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
