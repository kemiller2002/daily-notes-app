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

      <menu>
        <label for="showMenu">
          <i class="fa fa-bars menu"></i>
        </label>
        <input
          type="checkbox"
          name="showMenu"
          id="showMenu"
          className="showMenu"
        />
        <div className="menuItems">
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
        </div>
      </menu>
    </header>
  );
}
