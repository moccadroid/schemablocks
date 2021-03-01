import {Button, Box, Dialog, Slide} from "@material-ui/core";
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
      setImages([defaultValue]);
    }
  }, []);

  const openMediaLibrary = () => {
    setLibraryOpen(true);
  }
  const closeMediaLibrary = (images) => {
    setLibraryOpen(false);

    if (images) {
      setImages(images);
      onChange(images[0]);
    }
  }

  if (controls.type === "image") {
    return (
      <Box>
        <Box>
          {images.map(image => {
            return <img key={image.id} alt={image.alt} style={{width: 200}} src={image.url}/>
          })}
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
          <MediaLibray onClose={closeMediaLibrary} multiSelect={false} selected={images}/>
        </Dialog>
      </Box>
    );
  }

  return false;
}
