import {Box, Grid, TextField, Typography} from "@material-ui/core";
import React, {useState} from "react";

export default function LinkInput({ onChange, defaultValue = {}, controls}) {

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  function onLinkChange(value) {
    setName(value);
    onChange({ name, url })
  }
  function onUrlChange(value) {
    setUrl(value);
    onChange({ name, url });
  }

  return (
    <Box border={1} borderColor={"grey.400"} borderRadius={1} p={1}>
      <Box mb={1}><Typography>Link</Typography></Box>
      <Grid container spacing={2}>
        <Grid item>
          <TextField
            label={"Name"}
            onChange={event => onLinkChange(event.target.value)}
            defaultValue={defaultValue?.name}
          />
        </Grid>
        <Grid item>
          <TextField
            label={"Url"}
            onChange={event => onUrlChange(event.target.value)}
            defaultValue={defaultValue?.url}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
