import {
  AppBar,
  Button,
  Container,
  Dialog,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Slide,
  Toolbar,
  Typography
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

export default function Panel({ slug, children }) {

  const styles = useStyles();
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState("image");
  const [lock, addLock, releaseLock] = useSlugLock(slug);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLockAlert, setShowLockAlert] = useState(false);
  const slugRef = useRef();

  function handleSave() {
    if(slugRef.current) {
      slugRef.current.save();
    }
  }

  function handlePreview() {
    if (slugRef.current) {
      slugRef.current.preview();
    }
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
      console.log("lock on slug released");
      releaseLock();
    } else if (lock && lock.email !== email) {
      console.log("slug currently in use by", lock.email);
      setShowLockAlert(true);
    } else {
      addLock();
      console.log("slug is now locked by", email);
    }
  }

  function createDeleteDialog() {
    if (!lock) {
      setShowDeleteDialog(true);
    } else {
      console.log("can't delete, slug in use by", lock.email);
    }
  }

  function handleMediaTypeChange(event) {
    setMediaType(event.target.value);
  }

  return (
    <div className={styles.root}>
      <AppBar position={"fixed"}>
        <Toolbar>
          <Grid container justifyContent={"flex-start"} xs={1}>
            <Typography variant={"h6"}>{slug?.title}</Typography>
          </Grid>
          <Grid container justifyContent={"flex-end"} spacing={2} alignItems={"center"}>
            <Grid item>
              <FormControl className={styles.fromControl}>
                <Select
                  className={styles.select}
                  value={mediaType}
                  onChange={handleMediaTypeChange}
                  label="Media Type"
                  inputProps={{ classes: { icon: styles.icon }}}
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
            <Grid item>
              <Button variant={"outlined"} color="inherit" onClick={handlePreview}>Preview</Button>
            </Grid>
            <Grid item>
              <Button variant={"outlined"} color="inherit" onClick={handleSave}>Save Changes</Button>
            </Grid>
            <Grid item>
              <IconButton onClick={toggleSlugLock}>
                {lock ? <LockIcon style={{ color: "white"}}/> : <LockOpenIcon style={{color: "white"}} /> }
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
      <Container className={styles.container}>
        {children}
      </Container>
      {slug && <Slug slug={slug} ref={slugRef} />}
      <ConfirmationDialog
        open={showDeleteDialog}
        text={"Do you really want to delete this page? It can't be recovered after that."}
        title={`Delete page ${slug.name}?`}
        onClose={handleDelete}
      />
      <InfoDialog
        open={showLockAlert}
        title={"This slug is locked"}
        text={`This slug is currently locked by ${lock?.email}. Please ask them to remove the lock.`}
        onClose={() => setShowLockAlert(false)}
      />
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingBottom: 400
  },
  container: {
    marginTop: 100,
  },
  formControl: {
    minWidth: 200
  },
  select: {
    color: "white!important",
    '&:before': {
      borderColor: "rgb(255,255,255)!important",
    },
    '&:after': {
      borderColor: "rgb(255,255,255)!important",
    }
  },
  icon: {
    fill: "rgb(255,255,255)!important",
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
