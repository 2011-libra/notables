import React from 'react';
import './navbar.css';

function Navbar(props) {
  return (
    <div className="nav">
      <nav className="navbar">
        <div className="header-logo">
          <img src="./images/logo.png" alt="" />
        </div>
        <ul className="navbar-nav">{props.children}</ul>
      </nav>
    </div>
  );
}

export default Navbar;
