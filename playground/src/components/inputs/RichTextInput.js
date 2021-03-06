import React from 'react';
import {Box, Typography} from "@material-ui/core";
import ReactQuill from 'react-quill';

export default function RichTextInput({ controls, defaultValue, onChange }) {

  return (
    <Box mb={2}>
      <Typography variant={"caption"}>{controls.name}</Typography>
      <ReactQuill
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </Box>
  )
}
