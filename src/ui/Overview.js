import React, {useEffect, useState} from "react";
import {Box, Paper, Typography} from "@material-ui/core";
import {getFirebase} from "../lib/firebaseConfig";

export default function Overview({ collections }) {

  const [segments, setSegments] = useState([]);

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
        return { name: collection.name, slugs: Array.from(slugs) };
      }));

      setSegments(collectionData);
    })()


  }, []);

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto"}}>
      {segments.map((segment, i) => {
        return (
          <Box key={"collection" + i} mt={2}>
            <Typography variant={"h6"}>{segment.name}</Typography>
            {segment.slugs.map((slug, j) => {
              return (
                <Box key={"slug" + i + "_" + j} mt={2}>
                  <Paper>
                    <Box p={2}>
                      <Typography variant={"body1"}>{slug}</Typography>
                    </Box>
                  </Paper>
                </Box>
              )
            })}
          </Box>
        )
      })}
    </Box>
  )
}
