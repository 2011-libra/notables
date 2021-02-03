import React from 'react';
import './navbar.css';

function Navbar(props) {
  return (
    <div className="nav">
      <nav className="navbar">
        <ul className="navbar-nav">{props.children}</ul>
      </nav>
    </div>
  );
}

export default Navbar;
