import React from "react";
import "../index.css";
const Navbar = ({ children }) => {
  return (
    <nav>
      <div className="navbar-whole">
        <a className="navbar-button" href="/">
          Książka kucharska
        </a>
        {children}
        <div className="navbar-buttons">
          <a className="navbar-button" href="/recipes/add">
            Dodaj przepis
          </a>
          <a className="navbar-button" href="/recipes/">
            Pokaż przepisy
          </a>
          <a className="navbar-button" href="/ingredient-creator/">
            Kreator składników
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
