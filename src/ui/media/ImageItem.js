import {ImageListItem, ImageListItemBar, CircularProgress, Checkbox} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import React, {useState} from 'react';

export default function ImageItem({ image, selected, onSelect }) {

  const [imageItem, setImageItem] = useState(image);
  const [showEdit, setShowEdit] = useState(false);

  function onBarClick(event) {
    event.stopPropagation();
    setShowEdit(showEdit => !showEdit);
  }

  const classes = useStyles();
  const actionIcon = image.processing ? <CircularProgress color="secondary"/> : <Checkbox checked={!!selected} className={classes.greenCheckbox} />

  return (
    <ImageListItem className={classes.imageListItem} key={image.id} onClick={() => onSelect(image)}>
      <img
        src={image.url}
        alt={image.title}
      />
      <ImageListItemBar
        title={image.title}
        subtitle={image.id}
        actionIcon={actionIcon}
        onClick={onBarClick}
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
