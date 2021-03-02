import React, {useState} from 'react';
import {TextField} from "@material-ui/core";

export default function TextInput({ defaultValue, error, name, controls, type, onChange, onBlur }) {

  const [inputValue, setInputValue] = useState(defaultValue ?? "");

  const handleChange = (event) => {
    const value = event.target.value;

    if (controls.maxLength && value.length > controls.maxLength) {
      return;
    }
    if (type === "number") {
      onChange(Number(value));
    }
    if (type === "string") {
      onChange(value + "");
    }
    setInputValue(value);
  }

  return (
    <TextField
      label={controls.name}
      name={name}
      value={inputValue}
      margin="normal"
      helperText={error ? "error: " + error.name : null}
      variant="outlined"
      type={type}
      error={!!error}
      fullWidth
      onChange={handleChange}
      onBlur={onBlur}
    />
  );
}
