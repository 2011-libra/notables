import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FaLink } from 'react-icons/fa';
import { addLink } from './hyperlink';
export default function hyperlinkAlert() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    if (
      //***DRY CODE, FIGURE WAY TO REFACTOR LATER***//
      document.getSelection().anchorNode === null ||
      document.getSelection().anchorNode.innerText === '' ||
      document.getSelection().anchorNode.className === 'toolbar' ||
      document.getSelection().anchorNode.nodeValue === 'About us' ||
      document.getSelection().anchorNode.nodeValue === 'Upload' ||
      document.getSelection().anchorNode.nodeValue === 'Download' ||
      document.getSelection().anchorNode.nodeValue === null ||
      document.getSelection().anchorNode.length < 2
      //***DRY CODE, FIGURE WAY TO REFACTOR LATER***//
    ) {
      setOpen(true);
    } else {
      addLink();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>
        <FaLink />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Error'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please select/highlight the text you are intending to hyperlink
            first.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
