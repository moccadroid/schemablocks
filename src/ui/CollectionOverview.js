import React, {useEffect, useState} from "react";
import {Box, Button, Paper, Typography} from "@material-ui/core";
import {getConfiguration} from "../lib/configuration";
import {Link, useHistory} from "react-router-dom";
import InputDialog from "./alerts/InputDialog";

export default function CollectionOverview({ collections, pathPrefix }) {
  const [segments, setSegments] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);
  const router = useHistory();

  const firebase = getConfiguration().firebase;

  useEffect(() => {
    (async () => {
      const collectionData = await Promise.all(collections.map(async collection => {
        const snapshot = await firebase.firestore().collection(collection.value).get();
        const slugs = new Set();
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.slug) {
            slugs.add(data.slug);
          }
        });
        return { value: collection.value, name: collection.name, slugs: Array.from(slugs) };
      }));

      setSegments(collectionData);
    })()
  }, []);

  function createNewSlug(newSlugName) {
    if (newSlugName) {
      setCurrentCollection(null);
      const target = `${pathPrefix}/slug/${currentCollection}/${newSlugName}`;
      router.push(target);
    }
    setShowDialog(false);
  }

  function setupDialog(collection) {
    setCurrentCollection(collection);
    setShowDialog(true);
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto"}}>
      {segments.map((segment, i) => {
        return (
          <Box key={"collection" + i} mt={2}>
            <Typography variant={"h6"}>{segment.name}</Typography>
            {segment.slugs.map((slug, j) => {
              return (
                <Box key={"slug" + i + "_" + j} mt={2}>
                  <Link to={`${pathPrefix}/slug/${segment.value}/${slug}`} style={{ textDecoration: 'none' }}>
                    <Paper>
                      <Box p={2}>
                        <Typography variant={"body1"}>{slug}</Typography>
                      </Box>
                    </Paper>
                  </Link>
                </Box>
              )
            })}
            <Box mt={2}>
              <Button variant={"contained"} onClick={() => setupDialog(segment.value)}>Create New</Button>
            </Box>
          </Box>
        )
      })}
      <InputDialog
        open={showDialog}
        title={"New Page"}
        text={"Please enter the name of the new page"}
        onClose={createNewSlug}
      />
    </Box>
  )
}
