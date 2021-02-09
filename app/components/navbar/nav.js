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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Dropzone from '../import/dropzone';
const drawerWidth = 500;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  // appBar: {
  //   transition: theme.transitions.create(['margin', 'width'], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.leavingScreen
  //   })
  // },
  // appBarShift: {
  //   width: `calc(100% - ${drawerWidth}px)`,
  //   marginLeft: drawerWidth,
  //   transition: theme.transitions.create(['margin', 'width'], {
  //     easing: theme.transitions.easing.easeOut,
  //     duration: theme.transitions.duration.enteringScreen
  //   })
  // },
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

  const itemsList = [
    {
      text: 'Home',
      icon: <InboxIcon />
      // onClick: () => history.push("/")
    },
    {
      text: 'About',
      icon: <MailIcon />
      // onClick: () => history.push("/about")
    },
    {
      text: 'Contact',
      icon: <MailIcon />
      // onClick: () => history.push("/contact")
    }
  ];

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
        {/* <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      > */}
        {/* <Toolbar> */}
        {/* <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, open && classes.hide)}
        >
          <MenuIcon />
        </IconButton> */}
        {/* <Typography variant="h6" noWrap>
            Persistent drawer
          </Typography> */}
        {/* </Toolbar> */}
        {/* </AppBar> */}
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
            {/* <img className="header-logo" src="./images/logo.png" alt="" /> */}
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            {itemsList.map((item, index) => {
              const { text, icon, onClick } = item;
              return (
                <ListItem button key={text} onClick={onClick}>
                  {icon && <ListItemIcon>{icon}</ListItemIcon>}
                  <ListItemText primary={text} />
                </ListItem>
              );
            })}
            {/* <Dropzone /> */}
          </List>
        </Drawer>
      </div>
      <img className="header-logo" src="./images/logo.png" alt="" />
      <div className="header-name">NOTEABLES</div>

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
