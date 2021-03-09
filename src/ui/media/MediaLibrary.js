import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button, Grid,
  IconButton,
  ImageList,
  Toolbar,
  Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import CloseIcon from '@material-ui/icons/Close';
import {getFirebase} from "../../lib/firebaseConfig";
import uuidv4 from "../../lib/uuidv4";
import {getMediaLibraryConfig} from "../../lib/mediaLibraryConfig";
import ImageItem from "./ImageItem";
require('firebase/storage');
//require('firebase/firestore');

export default function MediaLibray({ onClose, multiSelect, selected = [], noEdit = false, type = "images"}) {

  const config = getMediaLibraryConfig();
  if (!config.imageMagicUrl || !config.firestoreCollection) {
    return <h1>Please set "imageMagicUrl" and "firestoreCollection" in config</h1>;
  }
  const imageMagicUrl = config.imageMagicUrl;
  const baseFolder = "mediaLibrary";

  const [libraryVideos, setLibraryVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [libraryImages, setLibraryImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(selected);
  const [currentFolder, setCurrentFolder] = useState(baseFolder + '/' + type);
  const [columns, setColumns] = useState(3);
  const classes = useStyles();


  useEffect(() => {
    loadMedia().then(() => console.log(type, 'loaded'));

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleResize = () => {
    const colWidth = 300;
    let cols = Math.round(window.innerWidth / colWidth);
    setColumns(cols);
  }

  const loadMedia = async () => {
    const media = [];
    const snapshot = await getFirebase().firestore().collection(config.firestoreCollection).where('type', '==', type).get();
    snapshot.forEach(doc => {
      media.push(doc.data());
    });
    if (type === "videos") {
      setLibraryVideos(media);
    } else {
      setLibraryImages(media);
    }
  }

  const handleUpload = ({ target }) => {
    if (noEdit) {
      return
    }

    let reader = new FileReader();
    let file = target.files[0];

    reader.onloadend = async () => {
      const fileId = uuidv4();
      const extension = file.name.split('.').pop();
      const storageRef = getFirebase().storage().ref(currentFolder);
      const mediaRef = storageRef.child(fileId + '/' + file.name);
      const snapshot = await mediaRef.put(file);
      const url = await snapshot.ref.getDownloadURL();

      let media = {};

      if (type === "videos") {
        media = {
          id: fileId,
          url,
          alt: "",
          mimeType: "video/" + extension,
          title: file.name,
          autoplay: false,
          usedInBlocks: []
        }
      } else {
        media = {
          id: fileId,
          url,
          alt: "",
          mimeType: "image/" + extension,
          title: file.name,
          usedInBlocks: []
        }
      }
      await getFirebase().firestore().collection(baseFolder).doc(fileId).set(media);

      if (type === "images") {
        media.processing = true;
        setLibraryImages(images => [image, ...images]);

        const response = await fetch(config.imageMagicUrl + '?id=' + fileId);
        setLibraryImages(images => images.map(img => {
          // remove processing field from image
          if (img.id === fileId) {
            const {processing, ...newImg} = img;
            return newImg;
          }
          return img;
        }))
        if (response.status === 200) {
          console.log('image was successfully processed', file.name);
        } else {
          console.log('there was an error processing this image', file.name);
        }
      } else {
        setLibraryVideos(videos => [...videos, media]);
      }
    };

    reader.readAsDataURL(file)
  };

  function createSchemaVideo(video) {
    return {
      id: video.id,
      url: video.url,
      alt: video.alt,
      autoplay: video.autoplay,
      mimeType: video.mimeType
    }
  }

  function createSchemaImage(image) {
    return {
      id: image.id,
      url: image.url,
      alt: image.alt,
      mimeType: image.mimeType,
    }
  }

  const handleImageSelect = (image) => {
    if (image.processing) return;

    setSelectedImages(images => {
      const index = images.findIndex(img => img.id === image.id);
      if (index === -1) {
        if (multiSelect) {
          return [...selectedImages, createSchemaImage(image)];
        }
        return [createSchemaImage(image)];
      } else {
        return images.filter(img => img.id !== image.id);
      }
    });
  }

  const handleImageDelete = async () => {
    if (noEdit) {
      return
    }

    await Promise.all(selectedImages.map(async image => {
      return await getFirebase().firestore().collection(config.firestoreCollection).doc(image.id).delete();
    }));
    setSelectedImages([]);
    loadMedia(currentMedia).then(() => console.log(currentMedia, 'loaded'));
  };

  const handleImageChange = async (image) => {
    setLibraryImages(images => images.map(img => img.id === image.id ? image : img));
    await getFirebase().firestore().collection(baseFolder).doc(image.id).set(image);
  }

  const handleClose = () => {
    onClose();
  }

  const onSelect = () => {
    onClose(selectedImages);
  }

  return (
    <Box>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} component="div">Media Library</Typography>
          <Button disabled={selectedImages.length === 0} variant="contained" onClick={onSelect}>Select</Button>
        </Toolbar>
      </AppBar>
      <Box>
        <Box padding={3}>
          <Grid spacing={2} container>
            <Grid item>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                disabled={noEdit}
                onChange={handleUpload}
              />
              <label htmlFor="contained-button-file">
                <Button disabled={noEdit} variant="contained" component="span">Upload New</Button>
              </label>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                disabled={noEdit || selectedImages.length === 0}
                onClick={handleImageDelete}
                color={"secondary"}
              >Delete</Button>
            </Grid>
          </Grid>
        </Box>
        <ImageList cols={columns} className={classes.imageList}>
          {libraryImages.map((image) => {
            const selected = selectedImages.find(img => img.id === image.id);
            return (
              <ImageItem
                key={image.id}
                image={image}
                selected={selected}
                onSelect={handleImageSelect}
                onChange={handleImageChange}
              />
            )
          })}
        </ImageList>
      </Box>
    </Box>
  )
};

const useStyles = makeStyles((theme) => ({
  imageList: {
    padding: 24,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  input: {
    display: 'none'
  }
}));
