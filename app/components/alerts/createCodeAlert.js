import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FaCode } from 'react-icons/fa';
import addCodeBlock from '../../utils/addCodeBlock';

export default function createCodeAlert() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    const target = document.getSelection();
    if (
      //   target.anchorNode.localName === 'div' ||
      target.anchorNode === null ||
      target.anchorNode.localName === 'a' ||
      target.focusNode.nodeName.includes('#text') ||
      target.focusNode.classList.contains('title') ||
      target.focusNode.className.includes('codeBlock') ||
      target.focusNode.className.includes('code-blocks')
    ) {
      setOpen(true);
    } else {
      addCodeBlock();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>
        <FaCode />
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
            To add a code block, please start on a new line inside the text
            area.
          </DialogContentText>
          <DialogContentText>
            NOTE: Inline code blocks are not premitted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
