import {
  AppBar, Box,
  Button,
  Dialog,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Slide,
  Toolbar
} from "@material-ui/core";
import React, {forwardRef, useState, useEffect, useRef} from "react";
import Slug from "./Slug";
import MediaLibray from "./media/MediaLibrary";
import {makeStyles} from "@material-ui/core/styles";
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import IconButton from "@material-ui/core/IconButton";
import {getAuthUser} from "../lib/auth";
import useSlugLock from "../hooks/useSlugLock";
import ConfirmationDialog from "./alerts/ConfirmationDialog";
import InfoDialog from "./alerts/InfoDialog";

export default function Panel({ slug, fixedHeader = true, children }) {

  if (!slug) {
    return false
  }

  const styles = useStyles();
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState("image");
  const [lock, addLock, releaseLock] = useSlugLock(slug);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLockAlert, setShowLockAlert] = useState(false);
  const slugRef = useRef();


  function handleSave() {
    if (lock && lock.email !== getAuthUser()?.email) {
      setShowLockAlert(true);
      return;
    }
    if(slugRef.current) {
      slugRef.current.save();
    }
  }

  function handlePreview() {
    if (slugRef.current) {
      slugRef.current.preview();
    }
  }

  function handleLockAlertClick(value) {
    if (value) {
      releaseLock(true);
      addLock();
    }
    setShowLockAlert(false);
  }

  function handleDelete(value) {
    if (value && slugRef.current) {
      slugRef.current.delete();
    }
    setShowDeleteDialog(false);
  }

  function toggleSlugLock() {
    const email = getAuthUser()?.email;
    if (lock && lock.email === email) {
      releaseLock();
    } else if (lock && lock.email !== email) {
      setShowLockAlert(true);
    } else {
      addLock();
    }
  }

  function createDeleteDialog() {
    if (!lock) {
      setShowDeleteDialog(true);
    } else {
      setShowLockAlert(true);
    }
  }

  function handleMediaTypeChange(event) {
    setMediaType(event.target.value);
  }

  function resolveLockColor() {
    if (lock && lock.email !== getAuthUser()?.email) {
      return "red";
    }
    return "#000";
  }

  return (
    <div className={styles.root}>
      <AppBar position={fixedHeader ? "fixed" : "static"} color={"transparent"}>
        <Toolbar>
          <Grid container justifyContent={"flex-end"} spacing={2} alignItems={"center"}>
            <Grid item>
              <FormControl className={styles.fromControl}>
                <Select
                  value={mediaType}
                  onChange={handleMediaTypeChange}
                  label="Media Type"
                >
                  <MenuItem value={"image"}>Images</MenuItem>
                  <MenuItem value={"video"}>Videos</MenuItem>
                  <MenuItem value={"svg"}>SVGs</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Button variant={"contained"} color={"primary"} onClick={() => setShowMediaLibrary(true)}>
                <span style={{ textTransform: "uppercase"}}>{mediaType}</span>&nbsp;MediaLibrary
              </Button>
            </Grid>
            <Grid item>
              <Button variant={"contained"} color="secondary" onClick={createDeleteDialog}>Delete</Button>
            </Grid>
            {/*
            <Grid item>
              <Button variant={"outlined"} color="inherit" onClick={handlePreview}>Preview</Button>
            </Grid>
            */}
            <Grid item>
              <Button variant={"outlined"} color="inherit" onClick={handleSave}>Save Changes</Button>
            </Grid>
            <Grid item>
              <IconButton onClick={toggleSlugLock}>
                {lock
                  ? <LockIcon style={{ color: resolveLockColor()}}/>
                  : <LockOpenIcon style={{color: resolveLockColor()}} />
                }
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Dialog
        fullScreen
        open={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        TransitionComponent={Transition}
      >
        <MediaLibray
          type={mediaType}
          onClose={() => setShowMediaLibrary(false)}
        />
      </Dialog>
      <Box mt={2}>
        {children}
      </Box>
      {slug && <Slug slug={slug} ref={slugRef} />}
      <ConfirmationDialog
        open={showDeleteDialog}
        text={"Do you really want to delete this page? It can't be recovered after that."}
        title={`Delete page ${slug.name}?`}
        onClose={handleDelete}
      />
      <ConfirmationDialog
        open={showLockAlert}
        title={"This slug is locked"}
        text={`This slug is currently locked by ${lock?.email}. Do you want to release this lock? (Not recommended)`}
        onClose={handleLockAlertClick}
      />
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingBottom: 400
  },
  formControl: {
    minWidth: 200
  }
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
