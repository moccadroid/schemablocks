import {
  AppBar,
  Button,
  Container,
  Dialog, FormControl,
  Grid,
  MenuItem,
  Select,
  Slide,
  Toolbar,
  Typography
} from "@material-ui/core";
import React, {forwardRef, useState, useEffect} from "react";
import Slug from "./Slug";
import MediaLibray from "./media/MediaLibrary";
import {makeStyles} from "@material-ui/core/styles";

export default function Panel({ slugs, children }) {

  const styles = useStyles();
  const [name, setName] = useState("");
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState("image");
  const [canDelete, setCanDelete] = useState(false);

  let slugSave = null;
  let slugPreview = null;
  let slugDelete = null;

  function handleSlugInViewport({ name, onSave, onPreview, onDelete }) {
    slugSave = onSave;
    slugPreview = onPreview;
    slugDelete = onDelete;
    setName(name);

    setCanDelete(!!onDelete);
  }

  function handleSave() {
    if (slugSave) {
      slugSave();
    }
  }

  function handlePreview() {
    if(slugPreview) {
      slugPreview();
    }
  }

  function handleDelete() {
    if (slugDelete) {
      slugDelete();
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
            <Typography variant={"h6"}>{name}</Typography>
          </Grid>
          <Grid container justifyContent={"flex-end"} spacing={2}>
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
              <Button disabled={!canDelete} variant={"contained"} color="secondary" onClick={handleDelete}>Delete</Button>
            </Grid>
            <Grid item>
              <Button variant={"outlined"} color="inherit" onClick={handlePreview}>Preview</Button>
            </Grid>
            <Grid item>
              <Button variant={"outlined"} color="inherit" onClick={handleSave}>Save Changes</Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {slugs?.map((slug, i) => {
        return <Slug slug={slug} key={"slug" + i} onInViewport={handleSlugInViewport}/>
      })}
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