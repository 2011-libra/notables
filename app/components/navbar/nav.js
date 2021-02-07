import React from 'react';
import { FaCog } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { BiExport } from 'react-icons/bi';
import { BiImport } from 'react-icons/bi';
const TurndownService = require('turndown').default;
let turndownService = new TurndownService()
turndownService.addRule('code-snippet', {
  filter: ['pre'],
  replacement: (content) => {
    return '```' + content.slice(1) + '```'
  }
})
import './nav.css';

function Nav() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const downloadTxtFile = () => {
    let innerHTML = document.getElementById('contentEditable').innerHTML;
    let markdown = turndownService.turndown(innerHTML);

    const element = document.createElement('a');
    const file = new Blob([markdown], {
      type: 'text/richtext;charset=utf-8'
    });
    element.href = URL.createObjectURL(file);
    element.download = 'myFile.txt';
    document.body.appendChild(element);
    element.click();
  };

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
          <BiImport title="Import" className="addMore" />
        </div>
        <div className="header-option">
          <BiExport
            onClick={downloadTxtFile}
            title="Export"
            className="addMore"
          />
        </div>
        <div className="header-option">
          <CgProfile title="Sign In" className="addMore" />
        </div>

        <div className="header-option">
          <FaCog title="Settings" onClick={handleClick} className="addMore" />
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
