import {FormControl, Box, InputLabel, MenuItem, Select} from "@material-ui/core";
import React, {useState,useEffect} from "react";

export default function SelectInput({ controls, id, options, error, onChange, defaultValue }) {

  const [value, setValue] = useState("");

  useEffect(() => {
    if (options.length > 0) {
      setValue(defaultValue ? defaultValue : options[0].value)
    }

  }, [options, defaultValue]);


  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <Box mt={1} mb={1}>
      <FormControl style={{ minWidth: 120 }} error={!!error}>
        <InputLabel>{controls.name}</InputLabel>
        <Select
          value={value}
          displayEmpty={!options}
          onChange={handleChange}
        >
          {options.map((option, i) => <MenuItem key={'option' + id + i} value={option.value}>{option.name}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  )
}
