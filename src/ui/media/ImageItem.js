import {ImageListItem, Grid, Box, Button, ImageListItemBar, CircularProgress, Checkbox, TextField} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import React, {useState} from 'react';
import Media from "./Media";

function Inputs({ image, onSave }) {
  const [alt, setAlt] = useState(image.alt ?? "");

  function handleSave() {
    onSave({
      ...image,
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

export default function ImageItem({ image, selected, onChange, onSelect }) {

  const [showEdit, setShowEdit] = useState(false);

  function onBarClick(event) {
    event.stopPropagation();
    if (!showEdit) {
      setShowEdit(true);
    } else {
      setShowEdit(false);
    }
  }

  function handleSave(image) {
    setShowEdit(false);
    onChange(image);
  }

  const classes = useStyles();
  const actionIcon = image.processing ? <CircularProgress color="secondary"/> : <Checkbox checked={!!selected} className={classes.greenCheckbox} />
  const sx = showEdit ? { top: 0, alignItems: "flex-start", wordWrap: "break-word" } : {};

  return (
    <ImageListItem className={classes.imageListItem} key={image.id} onClick={() => onSelect(image)}>
      <Media data={image} />
      <ImageListItemBar
        title={image.title}
        subtitle={showEdit ? <Inputs image={image} onSave={handleSave}/> : image.alt}
        actionIcon={showEdit ? null : actionIcon}
        onClick={onBarClick}
        sx={sx}
      />
    </ImageListItem>
  )
}

const useStyles = makeStyles((theme) => ({
  imageListItem: {
    cursor: "pointer"
  },
  greenCheckbox: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  }
}));
