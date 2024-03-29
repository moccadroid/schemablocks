import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@material-ui/core";
import React, {useState} from "react";

export default function InputDialog({ open, title, text, errorText, onClose }) {

  const [inputValue, setInputValue] = useState("");

  function handleClose(value) {
    onClose(value ? inputValue : false);
  }

  return (
    <Dialog open={open} onClose={() => handleClose(false)} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {errorText && <Alert severity="error">{errorText}</Alert> }
        <DialogContentText>{text}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label={title}
          type="text"
          fullWidth
          onChange={event => setInputValue(event.target.value)}
        />
        <DialogActions>
          <Button onClick={() => handleClose(false)} variant={"contained"} color="secondary">I changed my mind</Button>
          <Button onClick={() => handleClose(true)} variant={"contained"} color="primary" autoFocus>Let's go</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
