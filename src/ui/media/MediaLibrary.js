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

export default function MediaLibray({ onClose, multiSelect, selected = [] }) {

  const config = getMediaLibraryConfig();
  if (!config.imageMagicUrl) {
    console.error('imageMagicUrl was not set in config');
    return <h1>Please set imageMagicUrl in config</h1>;
  }

  const baseFolder = 'mediaLibrary';
  const imageFolder = 'images';
  const videoFolder = 'videos';

  const [libraryImages, setLibraryImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(selected);
  const [currentFolder, setCurrentFolder] = useState(baseFolder + '/' + imageFolder);
  const [currentMedia, setCurrentMedia] = useState('images');
  const [columns, setColumns] = useState(3);
  const classes = useStyles();



  useEffect(() => {
    loadMedia(currentMedia).then(() => console.log(currentMedia, 'loaded'));

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

  const loadMedia = async (type) => {
    const images = [];
    const snapshot = await getFirebase().firestore().collection('mediaLibrary').where('type', '==', 'images').get();
    snapshot.forEach(doc => {
      images.push(doc.data());
    });
    setLibraryImages(images);
  }

  const handleUpload = ({ target }) => {
    let reader = new FileReader();
    let file = target.files[0];

    reader.onloadend = async () => {
      const fileId = uuidv4();
      const extension = file.name.split('.').pop();
      const storageRef = getFirebase().storage().ref(currentFolder);
      const imageRef = storageRef.child(fileId + '/' + file.name);
      const snapshot = await imageRef.put(file);
      const url = await snapshot.ref.getDownloadURL();

      const image = {
        id: fileId,
        url,
        alt: "",
        mimeType: "image/" + extension,
        title: file.name,
        usedInBlocks: [],
        type: 'images'
      };
      await getFirebase().firestore().collection(baseFolder).doc(fileId).set(image);

      image.processing = true;
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
    };

    reader.readAsDataURL(file)
  };

  const createSchemaImage = (image) => {
    return {
      id: image.id,
      url: image.url,
      alt: image.alt,
      mimeType: "image/",
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
    await Promise.all(selectedImages.map(async image => {
      return await getFirebase().firestore().collection('mediaLibrary').doc(image.id).delete();
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
          <Box>

          </Box>
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
                onChange={handleUpload}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span">Upload New</Button>
              </label>
            </Grid>
            <Grid item>
              <Button variant="contained" disabled={selectedImages.length === 0} onClick={handleImageDelete} color={"secondary"}>Delete</Button>
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
