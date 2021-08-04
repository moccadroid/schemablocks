import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button, CircularProgress, FormControl, Grid,
  IconButton,
  ImageList, InputLabel, MenuItem, Select,
  Toolbar,
  Typography
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import uuidv4 from "../../lib/uuidv4";
import MediaItem from "./MediaItem";
import {getConfiguration} from "../../lib/configuration";
import {sortByDateField, sortByNumberField, sortByStringField} from "../../lib/utils";
require('firebase/storage');

export default function MediaLibray({ onClose, multiSelect = false, selected = [], noEdit = false, type = "image"}) {

  const config = getConfiguration().mediaLibrary;
  if (!config.imageMagicUrl || !config.collection) {
    return <h1>Please set "imageMagicUrl" and "firestoreCollection" in config</h1>;
  }

  const baseFolder = config.storageFolder;
  const firebase = getConfiguration().firebase;

  const [mediaFolder, setMediaFolder] = useState(resolveMediaFolder(type));
  const [libraryMedia, setLibraryMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(selected);
  const [currentFolder, setCurrentFolder] = useState(baseFolder + '/' + mediaFolder);
  const [columns, setColumns] = useState(3);
  const [sortBy, setSortBy] = useState("createdAt");
  const [uploadingMedia, setUploadingMedia] = useState(true);

  const classes = useStyles();


  useEffect(() => {
    loadMedia().then(() => console.log(mediaFolder, 'loaded'));

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    setMediaFolder(resolveMediaFolder(type));
  }, [type]);

  useEffect(() => {
    setUploadingMedia(false);
  }, [libraryMedia]);

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
    const snapshot = await firebase.firestore().collection(config.collection).where('type', '==', resolveMediaFolder(type)).get();
    snapshot.forEach(doc => {
      media.push(doc.data());
    });
    setLibraryMedia(media);
  };

  const handleUpload = async ({ target }) => {
    if (noEdit) {
      return
    }

    let files = [...target.files];

    setUploadingMedia(true);
    console.log("uploading start");

    await Promise.all(files.map(async file => {

      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const fileId = uuidv4();
        const extension = file.name.split('.').pop();
        const storageRef = firebase.storage().ref(currentFolder);
        const mediaRef = storageRef.child(fileId + '/' + file.name);
        const snapshot = await mediaRef.put(file);
        const url = await snapshot.ref.getDownloadURL();

        let mimeType = "image/" + extension;
        if (type === "video") {
          mimeType = "video/" + extension;
        }
        const media = {
          id: fileId,
          url,
          alt: "",
          mimeType,
          title: file.name,
          usedInBlocks: [],
          type: resolveMediaFolder(type),
          createdAt: new Date(),
          size: file.size
        }

        await firebase.firestore().collection(config.collection).doc(fileId).set(media);

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
      }
    }));
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
      return await firebase.firestore().collection(config.collection).doc(media.id).delete();
    }));
    setSelectedMedia([]);
    loadMedia().then(() => console.log(type, 'loaded'));
  };

  const handleMediaChange = async (media) => {
    setLibraryMedia(mediaItems => mediaItems.map(m => m.id === media.id ? media : m));
    await firebase.firestore().collection(config.collection).doc(media.id).set(media);
  }

  const handleClose = () => {
    if (onClose) {
      if (libraryMedia.length === 0) {
        onClose([]);
      }
      onClose();
    }
  }

  const handleSort = (event) => {
    const value = event?.target?.value ?? "title";
    setLibraryMedia(libraryMedia => {
      let list = [...libraryMedia];
      if (value === "title") {
        list = sortByStringField(list, value);
      } else if (value === "createdAt") {
        list = sortByDateField(list, value, "DESC");
      } else if (value === "size") {
        list = sortByNumberField(list, value);
      }
      return list;
    });
    setSortBy(value);
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
              <Select value={sortBy} onChange={handleSort}>
                <MenuItem value={"title"}>Title</MenuItem>
                <MenuItem value={"createdAt"}>Date</MenuItem>
                <MenuItem value={"size"}>Size</MenuItem>
              </Select>
            </Grid>
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
            {uploadingMedia &&
              <Grid item sx={{ display: "flex", alignItems: "center"}}>
                <Box sx={{ marginRight: 1 }}>
                  <CircularProgress size={20}/>
                </Box>
                <Box>
                  <Typography variant={"h6"}>Uploading...</Typography>
                </Box>
              </Grid>
            }
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

const useStyles = () => ({
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
    marginLeft: 10,
    flex: 1,
  },
  input: {
    display: 'none'
  }
});
