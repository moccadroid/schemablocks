import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";

export default function ConfirmationDialog({ open, title, text, onClose }) {

  function handleClose(value) {
    onClose(value);
  }

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} variant={"contained"} color="secondary">Oh No!</Button>
        <Button onClick={() => handleClose(true)} variant={"contained"} color="primary" autoFocus>Yes Please</Button>
      </DialogActions>
    </Dialog>
  )
}