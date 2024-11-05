import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { subscribe, unsubscribe } from "./Events";

export default function Header({ globalClickEventName }) {
  const [displayMenu, updateDisplayMenu] = useState(false);

  useEffect(() => {
    subscribe(globalClickEventName, () => {
      updateDisplayMenu(false);
    });
    return () => {
      unsubscribe(globalClickEventName);
    };
  }, []);

  return (
    <header>
      <h3>
        <span>Note Today Mr. Bond</span>
      </h3>

      <menu>
        <label htmlFor="showMenu">
          <i className="fa fa-bars menu"></i>
        </label>
        <input
          type="checkbox"
          name="showMenu"
          id="showMenu"
          className="showMenu"
          checked={displayMenu == true}
          onChange={(e) => {
            updateDisplayMenu(e.target.checked);
            //e.stopPropagation();
          }}
        />
        <div className="menuItems">
          <Link to="/">Dashboard</Link>
          <Link to="/follow-up">Follow Up</Link>
          <Link to="/categories">Categories</Link>
          <Link to="administration">Administration</Link>
          <Link to="/login">Login</Link>
        </div>
      </menu>
    </header>
  );
}
