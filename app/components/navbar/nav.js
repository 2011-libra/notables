import React from 'react';
import { FaCog } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { BiExport } from 'react-icons/bi';
import { BiImport } from 'react-icons/bi';
import './nav.css';

function Nav() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="header">
      <img className="header-logo" src="./images/logo.png" alt="" />
      <div className="header-name">NOTEABLES</div>

      <div className="header-nav">
        <div className="header-option">
          <BiImport className="header-searchIcon" />
        </div>
        <div className="header-option">
          <BiExport className="header-searchIcon" />
        </div>
        <div className="header-option">
          <CgProfile className="header-searchIcon" />
        </div>

        <div className="header-option">
          <FaCog onClick={handleClick} className="header-searchIcon" />
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Dark Mode</MenuItem>
            <MenuItem onClick={handleClose}>Word Count</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default Nav;
