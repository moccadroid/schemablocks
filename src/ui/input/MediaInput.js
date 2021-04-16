import {Button, Dialog, Box, Slide, Typography, Grid, Accordion} from "@material-ui/core";
import React, {useState, forwardRef, useEffect} from "react";
import MediaLibray from "../media/MediaLibrary";
import MediaWrapper from "../media/MediaWrapper";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MediaInput({ controls, error, defaultValue, onChange, disabled }) {

  const [media, setMedia] = useState([]);
  const [libraryOpen, setLibraryOpen] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        setMedia(defaultValue);
      } else {
        setMedia([defaultValue]);
      }
    }
  }, []);

  const openMediaLibrary = () => {
    setLibraryOpen(true);
  }
  const closeMediaLibrary = (media) => {
    setLibraryOpen(false);

    console.log(media);

    if (media) {
      setMedia(media);
      handleChange(media);
    }
  }

  function handleDelete(item) {
    if (!disabled) {
      const mediaItems = media.filter(m => m.id !== item.id);
      setMedia(mediaItems);
      handleChange(mediaItems);
    }
  }

  function handleChange(media) {
    if (controls.multiSelect) {
      onChange(media);
    } else {
      if (media.length === 0) {
        onChange({})
      } else {
        onChange(media[0]);
      }
    }
  }

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    let orderedList = Array.from(media);
    const [removed] = orderedList.splice(result.source.index, 1);
    orderedList.splice(result.destination.index, 0, removed);
    orderedList.forEach((r, i) => r.index = i);
    orderedList.sort((a,b) => a.index - b.index);
    setMedia(orderedList);
    handleChange(orderedList);
  }

  return (
    <Box mt={2} mb={2}>
      <Box mt={1} mb={1}>
        <Typography>{controls.name}</Typography>
      </Box>
      <Box sx={{minHeight: 20}}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={"droppable"} direction="horizontal">
            {(provided) => (
              <Grid
                container
                spacing={2}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {media.map((mediaItem, index) => {
                  if (mediaItem.hasOwnProperty("id")) {
                    return (
                      <Draggable key={mediaItem.id} draggableId={mediaItem.id + index} index={index}>
                        {(provided) => (
                          <Grid
                            item
                            sx={{width: 200}}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <MediaWrapper media={mediaItem} key={mediaItem.id}
                                          onDelete={() => handleDelete(mediaItem)}/>
                          </Grid>
                        )}
                      </Draggable>
                    )
                  }
                  return false;
                })}
                {provided.placeholder}
              </Grid>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      <Box>
        <Button
          disabled={disabled}
          variant="contained"
          color="primary"
          component="span"
          onClick={openMediaLibrary}
        >Add { controls.type }</Button>
      </Box>
      <Dialog
        fullScreen
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        TransitionComponent={Transition}
      >
        <MediaLibray
          onClose={closeMediaLibrary}
          multiSelect={controls.multiSelect ?? false}
          selected={media}
          type={controls.type}
          noEdit={disabled || controls.noEdit}
        />
      </Dialog>
    </Box>
  );
}
