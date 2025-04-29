import React from "react";
import "../index.css";
const Navbar = () => {
  return (
    <nav>
      <div className="navbar-whole">
        <a className="navbar-button" href="/">
          Cookbook App
        </a>
        <div className="navbar-buttons">
          <a className="navbar-button" href="/recipes/add">
            Add recipe
          </a>
          <a className="navbar-button" href="/recipes/">
            View recipes
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
