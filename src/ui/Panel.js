import {AppBar, Button, Container, Grid, Toolbar, Typography} from "@material-ui/core";
import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Slug from "./Slug";

export default function Panel({ slugs, children }) {

  const styles = useStyles();
  const [name, setName] = useState("");
  const [onSlugSave, setOnSlugSave] = useState(null);
  const [onSlugPreview, setOnSlugPreview] = useState(null);
  const [onSlugDelete, setOnSlugDelete] = useState(null);

  let slugSave = null;
  let slugPreview = null;
  let slugDelete = null;
  let slugName = "";

  function saveChanges() {
    console.log("save");
  }

  function handleSlugInViewport({ name, onSave, onPreview, onDelete }) {
    slugSave = onSave;
    slugPreview = onPreview;
    slugDelete = onDelete;
    setName(name);
  }

  function handleSave() {
    if (slugSave) {
      slugSave();
    }
  }

  function handlePreview(data) {
    if(slugPreview) {
      slugPreview();
    }
  }

  return (
    <div className={styles.root}>
      <AppBar position={"fixed"}>
        <Toolbar>
          <Grid container justifyContent={"flex-start"}>
            <Typography variant={"h6"}>{name}</Typography>
          </Grid>
          <Grid container justifyContent={"flex-end"} spacing={2}>
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
  }
}));
