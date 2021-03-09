import {ImageListItem, Grid, Box, Button, ImageListItemBar, CircularProgress, Checkbox, TextField} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import React, {useState} from 'react';
import Media from "./Media";

function Inputs({ media, onSave }) {
  const [alt, setAlt] = useState(media.alt ?? "");

  function handleSave() {
    onSave({
      ...media,
      alt
    });
  }

  function handleClick(event) {
    event.stopPropagation();
  }

  return (
    <Grid container spacing={1} p={1} mt={2} sx={{ backgroundColor: "white" }} onClick={handleClick}>
      <Grid item sx={{ width: "calc(100% + 8px)"}}>
        <TextField
          fullWidth
          label={"Alt Text"}
          value={alt}
          onChange={event => setAlt(event.target.value)}
        />
      </Grid>
      <Grid item>
        <Button variant={"contained"} onClick={handleSave}>Save</Button>
      </Grid>
    </Grid>
  )
}

export default function MediaItem({ media, selected, onChange, onSelect }) {

  const [showEdit, setShowEdit] = useState(false);

  function onBarClick(event) {
    event.stopPropagation();
    if (!showEdit) {
      setShowEdit(true);
    } else {
      setShowEdit(false);
    }
  }

  function handleSave(media) {
    setShowEdit(false);
    onChange(media);
  }

  const classes = useStyles();
  const actionIcon = media.processing ? <CircularProgress color="secondary"/> : <Checkbox checked={!!selected} className={classes.greenCheckbox} />
  const sx = showEdit ? { top: 0, alignItems: "flex-start", wordWrap: "break-word" } : {};

  return (
    <ImageListItem className={classes.mediaListItem} key={media.id} onClick={() => onSelect(media)}>
      <Media data={media} />
      <ImageListItemBar
        title={media.title}
        subtitle={showEdit ? <Inputs media={media} onSave={handleSave}/> : media.alt}
        actionIcon={showEdit ? null : actionIcon}
        onClick={onBarClick}
        sx={sx}
      />
    </ImageListItem>
  )
}

const useStyles = makeStyles((theme) => ({
  mediaListItem: {
    cursor: "pointer"
  },
  greenCheckbox: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  }
}));
