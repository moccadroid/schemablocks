import {Button, Box, Dialog, Slide, Typography, Grid} from "@material-ui/core";
import React, {useState, forwardRef, useEffect} from "react";
import MediaLibray from "../media/MediaLibrary";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MediaInput({ controls, error, defaultValue, onChange }) {

  const [images, setImages] = useState([]);
  const [libraryOpen, setLibraryOpen] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        setImages(defaultValue);
      } else {
        setImages([defaultValue]);
      }
    }
  }, []);

  const openMediaLibrary = () => {
    setLibraryOpen(true);
  }
  const closeMediaLibrary = (images) => {
    setLibraryOpen(false);

    if (images) {
      setImages(images);
      if (controls.multiSelect) {
        onChange(images);
      } else {
        onChange(images[0]);
      }
    }
  }

  if (controls.type === "image") {
    return (
      <Box mt={2} mb={2}>
        <Box mt={1} mb={1}>
          <Typography>{controls.name}</Typography>
        </Box>
        <Box sx={{ minHeight: 20 }}>
          <Grid container spacing={2}>
            {images.map(image => {
              return (
                <Grid item key={image.id}>
                  <img key={image.id} alt={image.alt} style={{width: 200}} src={image.url}/>
                </Grid>
              )
            })}
          </Grid>
        </Box>
        <Box>
          <Button variant="contained" color="primary" component="span" onClick={openMediaLibrary}>Add Image</Button>
        </Box>
        <Dialog
          fullScreen
          open={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          TransitionComponent={Transition}
        >
          <MediaLibray onClose={closeMediaLibrary} multiSelect={controls.multiSelect ?? false} selected={images}/>
        </Dialog>
      </Box>
    );
  }

  return false;
}
