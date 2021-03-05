import {Box, FormControlLabel, Grid, Switch, TextField, Typography} from "@material-ui/core";
import React, {useState} from "react";

export default function LinkInput({ onChange, defaultValue = {}, controls}) {

  const [name, setName] = useState(defaultValue?.name ?? "");
  const [url, setUrl] = useState(defaultValue?.url ?? "");
  const [openInNew, setOpenInNew] = useState(defaultValue?.openInNew ?? false);

  function onNameChange(value) {
    setName(value);
    onChange({ name: value, url, openInNew })
  }
  function onUrlChange(value) {
    setUrl(value);
    onChange({ name, url: value, openInNew });
  }

  function onOpenInNewChange(value) {
    setOpenInNew(value);
    onChange({ name, url, openInNew: value });
  }

  return (
    <Box mt={2} mb={1}>
      <Box><Typography>Link</Typography></Box>
      <Box mb={1}>
        <FormControlLabel control={
          <Switch
            defaultChecked={defaultValue?.openInNew}
            onChange={event => onOpenInNewChange(event.target.checked)}
          />
        } label={"Open in new tab"} />
      </Box>
      <Grid container spacing={2}>
        <Grid item>
          <TextField
            label={"Name"}
            onChange={event => onNameChange(event.target.value)}
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
