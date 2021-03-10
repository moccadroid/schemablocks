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
import MediaItem from "./MediaItem";
require('firebase/storage');
//require('firebase/firestore');

export default function MediaLibray({ onClose, multiSelect, selected = [], noEdit = false, type = "image"}) {

  const config = getMediaLibraryConfig();
  if (!config.imageMagicUrl || !config.firestoreCollection) {
    return <h1>Please set "imageMagicUrl" and "firestoreCollection" in config</h1>;
  }

  const mediaFolder = resolveMediaFolder(type);
  const baseFolder = "mediaLibrary";

  const [libraryVideos, setLibraryVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [libraryImages, setLibraryImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(selected);
  const [libraryMedia, setLibraryMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(selected);
  const [currentFolder, setCurrentFolder] = useState(baseFolder + '/' + mediaFolder);
  const [columns, setColumns] = useState(3);
  const classes = useStyles();


  useEffect(() => {
    loadMedia().then(() => console.log(mediaFolder, 'loaded'));

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  function resolveMediaFolder(type) {
    if (type === "video") return "videos";
    if (type === "image") return "images";
    if (type === "svg") return "svgs";
  }

  function resolveInputAccept(type) {
    if (type === "video") return "video/*";
    if (type === "image") return ".png,.jpg,.jpeg,.webp";
    if (type === "svg") return ".svg";
  }

  const handleResize = () => {
    const colWidth = 300;
    let cols = Math.round(window.innerWidth / colWidth);
    setColumns(cols);
  }

  const loadMedia = async () => {
    const media = [];
    const snapshot = await getFirebase().firestore().collection(config.firestoreCollection).where('type', '==', resolveMediaFolder(type)).get();
    snapshot.forEach(doc => {
      media.push(doc.data());
    });
    setLibraryMedia(media);
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

      if (type === "video") {
        media = {
          id: fileId,
          url,
          alt: "",
          mimeType: "video/" + extension,
          title: file.name,
          usedInBlocks: [],
          type: resolveMediaFolder(type)
        }
      } else if(type === "svg") {
        media = {
          id: fileId,
          url,
          alt: "",
          mimeType: "image/" + extension,
          title: file.name,
          usedInBlocks: [],
          type: resolveMediaFolder(type)
        }
      } else {
        media = {
          id: fileId,
          url,
          alt: "",
          mimeType: "image/" + extension,
          title: file.name,
          usedInBlocks: [],
          type: resolveMediaFolder(type)
        }
      }
      await getFirebase().firestore().collection(baseFolder).doc(fileId).set(media);

      if (type === "image") {
        media.processing = true;
      }
      setLibraryMedia(mediaItems => [media, ...mediaItems]);

      if (type === "image") {
        const response = await fetch(config.imageMagicUrl + '?id=' + fileId);
        setLibraryMedia(mediaItems => mediaItems.map(m => {

          if (m.id === fileId) {
            // remove processing field
            const {processing, ...newMedia} = m;
            if (response.status === 200) {
              console.log('image was successfully processed', file.name);
              return newMedia;
            } else {
              console.log('there was an error processing this image', file.name);
              return {...newMedia, encodingError: true}
            }
          }
          return m;
        }))
      }
    };

    reader.readAsDataURL(file)
  };

  function createSchemaMedia(media) {
    return {
      id: media.id,
      url: media.url,
      alt: media.alt,
      mimeType: media.mimeType,
      title: media.title
    }
  }

  const handleMediaSelect = (media) => {
    if (media.processing) return;

    setSelectedMedia(mediaItems => {
      const index = mediaItems.findIndex(m => m.id === media.id);
      if (index === -1) {
        const newMedia = createSchemaMedia(media);
        if (multiSelect) {
          return [...mediaItems, newMedia];
        }
        return [newMedia];
      } else {
        return mediaItems.filter(m => m.id !== media.id);
      }
    });
  }

  const handleMediaDelete = async () => {
    if (noEdit) {
      return
    }

    await Promise.all(selectedMedia.map(async media => {
      return await getFirebase().firestore().collection(config.firestoreCollection).doc(media.id).delete();
    }));
    setSelectedMedia([]);
    loadMedia().then(() => console.log(type, 'loaded'));
  };

  const handleMediaChange = async (media) => {
    setLibraryMedia(mediaItems => mediaItems.map(m => m.id === media.id ? media : m));
    await getFirebase().firestore().collection(baseFolder).doc(media.id).set(media);
  }

  const handleClose = () => {
    if (libraryMedia.length === 0) {
      onClose([]);
    }
    onClose();
  }

  const handleSelect = () => {
    onClose(selectedMedia);
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
          <Typography variant="h6" className={classes.title} component="div">Media Library / { type }</Typography>
          <Button disabled={selectedMedia.length === 0} variant="contained" onClick={handleSelect}>Select</Button>
        </Toolbar>
      </AppBar>
      <Box>
        <Box padding={3}>
          <Grid spacing={2} container>
            <Grid item>
              <input
                accept={resolveInputAccept(type)}
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
                disabled={noEdit || selectedMedia.length === 0}
                onClick={handleMediaDelete}
                color={"secondary"}
              >Delete</Button>
            </Grid>
          </Grid>
        </Box>
        <ImageList cols={columns} className={classes.mediaList}>
          {libraryMedia.map((media) => {
            const selected = selectedMedia.find(m => m.id === media.id);
            return (
              <MediaItem
                key={media.id}
                media={media}
                selected={selected}
                onSelect={handleMediaSelect}
                onChange={handleMediaChange}
              />
            )
          })}
        </ImageList>
      </Box>
    </Box>
  )
};

const useStyles = makeStyles((theme) => ({
  mediaList: {
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
