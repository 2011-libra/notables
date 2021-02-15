import React from 'react';
import { BiCloudDownload, BiCloudUpload } from 'react-icons/bi';
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
import createCodeRunnerEvent from '../../utils/createCodeRunnerEvent';
import About from '../about/about';
import Darkmode from 'darkmode-js';
new Darkmode().showWidget();

const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
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
    padding: theme.spacing(0, 0, 0, 0),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    backgoundColor: '#373d49'
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
    return '```' + content + '```';
  }
});
import './nav.css';

function Nav() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const downloadTxtFile = () => {
    let stdoutNodeList = document.getElementsByClassName('sandbox-stdout');
    let runButtonNodeList = document.getElementsByClassName('run-code-button');
    if (document.getElementById('contentEditable').innerHTML.length === 0) {
      alert('There is nothing to download!');
    } else {
      for (let i = stdoutNodeList.length - 1; i >= 0; i--) {
        stdoutNodeList[i].remove();
      }

      let innerHTML = document.getElementById('contentEditable').innerHTML;
      innerHTML = innerHTML.replace(/▶.Run.Code/g, '');

      let markdown = turndownService.turndown(innerHTML);

      const element = document.createElement('a');
      const file = new Blob([markdown], {
        type: 'text/richtext;charset=utf-8'
      });
      element.href = URL.createObjectURL(file);
      element.download = 'myFile.md';
      document.body.appendChild(element);
      element.click();
      createCodeRunnerEvent();
    }
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

  //***DARK MODE***//
  //Uncomment below for extra dark mode options!
  const options = {
    bottom: '32px', // default: '32px'
    right: 'unset', // default: '32px'
    left: '32px', // default: 'unset'
    time: '0.5s', // default: '0.3s'
    mixColor: '#FFFFFF', // default: '#fff'
    backgroundColor: '#fff', // default: '#fff'
    buttonColorDark: '#100f2c', // default: '#100f2c'
    buttonColorLight: '#fff', // default: '#fff'
    saveInCookies: false, // default: true,
    label: '🔆', // default: ''
    autoMatchOsTheme: false // default: true
  };

  const darkmode = new Darkmode(options);
  darkmode.showWidget();
  return (
    <div className="header">
      <div className={classes.root}>
        <CssBaseline />
        <Drawer
          className={classes.drawer}
          variant="temporary"
          onEscapeKeyDown={handleDrawerClose}
          onBackdropClick={handleDrawerClose}
          anchor="right"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <div className="drawer">
              <h1>Upload A File</h1>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </div>
          </div>
          <Divider className="drawer-divider" />
          <Dropzone />
        </Drawer>
      </div>
      <div className="header_container">
        <Link to="/">
          <img className="header-logo" src="./images/logo.png" alt="" />
        </Link>
        <Link to="/">
          <div className="header-name">NOTABLES</div>
        </Link>
      </div>
      <div className="header-nav">
        <div className="header-option">
          <BiCloudUpload
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          />

          <span className="header-optionLineOne">Upload</span>
        </div>
        <div className="header-option">
          <BiCloudDownload onClick={downloadTxtFile} />
          <span className="header-optionLineOne">Download</span>
        </div>

        <div className="header-option">
          <About title="What is Notables?" />
          <span className="header-optionLineOne">About us</span>
        </div>
      </div>
    </div>
  );
}

export default Nav;
