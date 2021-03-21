import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import React from "react";

export default function InfoDialog({ open, title, text, onClose }) {

  function handleClose() {
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} variant={"contained"} color="primary" autoFocus>I understand</Button>
      </DialogActions>
    </Dialog>
  )
}