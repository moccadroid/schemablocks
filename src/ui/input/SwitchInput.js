import React from 'react';
import {FormControlLabel, Switch} from "@material-ui/core";

export default function SwitchInput({ name, defaultValue, controls, onChange }) {

  return (

    <FormControlLabel control={
      <Switch
        defaultChecked={defaultValue}
        name={name}
        label={controls.name}
        onChange={event => onChange(event.target.checked)}
      />
    } label={controls.name} />
  )
}
