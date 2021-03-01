import React, {useState} from 'react';
import {TextField} from "@material-ui/core";

export default function TextInput({ defaultValue, error, name, controls, type, onChange }) {

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
      //helperText={controls.name}
      variant="outlined"
      type={type}
      error={!!error}
      fullWidth
      onChange={handleChange}
    />
  );
}
