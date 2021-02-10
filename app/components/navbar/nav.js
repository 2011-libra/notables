import React from 'react';
import { FaCog } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { BiExport } from 'react-icons/bi';
import { BiImport } from 'react-icons/bi';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Dropzone from '../import/dropzone';
import { Link } from 'react-router-dom';
const drawerWidth = 500;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    backgoundcolor: 'black'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
    // marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
}));

const TurndownService = require('turndown').default;
let turndownService = new TurndownService();
turndownService.addRule('code-snippet', {
  filter: ['pre'],
  replacement: content => {
    return '```' + content.slice(1) + '```';
  }
});
import './nav.css';

function Nav() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className="header">
      <div className={classes.root}>
        <CssBaseline />
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <h1>Drag 'n Drop!</h1>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <Dropzone />
        </Drawer>
      </div>
      <div className="header_container">
        <Link to="/">
          <img className="header-logo" src="./images/logo.png" alt="" />
        </Link>
        <div className="header-name">NOTEABLES</div>
      </div>
      <div className="header-nav">
        <div className="header-option">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <BiImport title="Import" className="addMore" />
          </IconButton>
        </div>
        <div className="header-option">
          <BiExport
            onClick={downloadTxtFile}
            title="Export"
            className="addMore"
          />
        </div>

        <div className="header-option">
          <Link to="/login">
            <CgProfile title="Sign In" className="addMore" />
          </Link>
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
