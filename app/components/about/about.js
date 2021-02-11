import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default function CustomizedDialogs() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className="header-option" onClick={handleClickOpen}>
        <HelpOutlineIcon title="What is Notables?" />
      </div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Notables
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Welcome to Notables! Want a light weight text editor? Do you want to
            be able to write plain text and save it as markdown? What about
            running live code within your text editor?
          </Typography>
          <br />
          <Typography gutterBottom>
            In Notables, you are able to write plain text while styling it, once
            you are happy with your work, you can click on the "Export" button.
            This will create a file called "myFile" onto your local machine as a
            .md file. If you take a look in the .md file, it is in complete
            markdown! Your regular text is now in markdown! Wow!!!
          </Typography>
          <br />
          <Typography gutterBottom>
            If you choose to upload a file, you can only upload .md or .txt
            files.
          </Typography>
          <Typography gutterBottom>
            While you are typing, you may give an code snippet example. Did you
            ever wish you could RUN that code to see if you wrote it properly?
            In the toolbar, there is that option. It will open up a codeblock
            for you to write your code and run, just by clicking the play
            button!
          </Typography>
          <br />
          <Typography gutterBottom>
            Thank you for using Notables! Please contact us if you have any
            questions! notables@notables.com
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
