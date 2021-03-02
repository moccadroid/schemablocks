import React from 'react';
import {FormControlLabel, Switch, Box} from "@material-ui/core";

export default function SwitchInput({ name, defaultValue, controls, onChange }) {

  return (
    <Box mt={1} mb={1}>
      <FormControlLabel control={
        <Switch
          defaultChecked={defaultValue}
          name={name}
          label={controls.name}
          onChange={event => onChange(event.target.checked)}
        />
      } label={controls.name} />
    </Box>
  )
}
