import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <h3>Note Today Mr. Bond</h3>
      <Button color="inherit" as={Link} to="/">
        Dashboard
      </Button>
      <Button color="inherit" as={Link}>
        Follow Up
      </Button>
      <Button color="inherit" as={Link} to="/categories">
        Categories
      </Button>
      <Button color="inherit" as={Link}>
        Administration
      </Button>
      <Button color="inherit" as={Link} to="/login">
        Login
      </Button>
    </header>
    /*
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar focusVisibleClassName="my-class">
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
            Note Today Mr. Bond
          </Typography>
          <Button color="inherit" as={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit">Follow Up</Button>
          <Button color="inherit" as={Link} to="/categories">
            Categories
          </Button>
          <Button color="inherit">Administration</Button>
          <Button color="inherit" as={Link} to="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
    */
  );
}
