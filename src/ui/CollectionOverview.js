import React, {useEffect, useState} from "react";
import {Box, Button, Grid, Paper, TextField, Typography} from "@material-ui/core";
import {getFirebase} from "../lib/firebaseConfig";
import {Link, useHistory} from "react-router-dom";
import InputDialog from "./alerts/InputDialog";

export default function CollectionOverview({ collections }) {
  const [segments, setSegments] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);
  const router = useHistory();

  useEffect(() => {
    (async () => {
      const collectionData = await Promise.all(collections.map(async collection => {
        const snapshot = await getFirebase().firestore().collection(collection.value).get();
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
      const target = `/slug/${currentCollection}/${newSlugName}`;
      console.log(target);
      router.push(target);
    }
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
                  <Link to={`/slug/${segment.value}/${slug}`}>
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
