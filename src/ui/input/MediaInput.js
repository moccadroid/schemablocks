import {Button, Dialog, Box, Slide, Typography, Grid} from "@material-ui/core";
import React, {useState, forwardRef, useEffect} from "react";
import MediaLibray from "../media/MediaLibrary";
import MediaWrapper from "../media/MediaWrapper";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MediaInput({ controls, error, defaultValue, onChange }) {

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

    if (media) {
      setMedia(media);
      if (controls.multiSelect) {
        onChange(media);
      } else {
        onChange(media[0]);
      }
    }
  }


  return (
    <Box mt={2} mb={2}>
      <Box mt={1} mb={1}>
        <Typography>{controls.name}</Typography>
      </Box>
      <Box sx={{ minHeight: 20 }}>
        <Grid container spacing={2}>
          {media.map(mediaItem => {
            return (
              <Grid item key={mediaItem.id} sx={{width: 200}}>
                <MediaWrapper media={mediaItem} key={mediaItem.id} />
              </Grid>
            )
          })}
        </Grid>
      </Box>
      <Box>
        <Button variant="contained" color="primary" component="span" onClick={openMediaLibrary}>Add { controls.type }</Button>
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
          noEdit={controls.noEdit}
        />
      </Dialog>
    </Box>
  );
}
