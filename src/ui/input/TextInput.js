import React from 'react';
import {TextField} from "@material-ui/core";

export default function TextInput({ defaultValue, error, name, controls, type, onChange }) {

  const handleChange = (event) => {
    if (type === "number") {
      onChange(Number(event.target.value));
    }
    if (type === "string") {
      onChange(event.target.value + "");
    }
  }

  return (
    <TextField
      label={controls.name}
      name={name}
      margin="normal"
      //helperText={controls.name}
      variant="outlined"
      type={type}
      error={!!error}
      defaultValue={defaultValue}
      fullWidth
      onChange={handleChange}
    />
  );
}
