import React from 'react';
import {Box, Typography} from "@material-ui/core";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(import('react-quill'), {ssr: false});

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
