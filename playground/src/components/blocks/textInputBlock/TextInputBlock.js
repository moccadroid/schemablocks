import {Box, Typography} from "@material-ui/core";
import SchemaView from "../../ui/SchemaView";
import schema from './TextInputBlock.schema.json';

export default function TextInputBlock({ block }) {

  const { data } = block;

  return (
    <Box>
      <Box mb={2}>
        <Typography variant={"caption"}>Normal Textfield:</Typography>
        <Typography>{data.normalText}</Typography>
      </Box>
      <Box mb={2}>
        <Typography variant={"caption"}>Not Empty Textfield:</Typography>
        <Typography>{data.notEmptyText}</Typography>
      </Box>
      <Box mb={2}>
        <Typography variant={"caption"}>Max Length Textfield:</Typography>
        <Typography>{data.maxLengthText}</Typography>
      </Box>
      <Box mb={2}>
        <Typography variant={"caption"}>Number Textfield:</Typography>
        <Typography>{data.number}</Typography>
      </Box>
      <Box mb={2}>
        <Typography variant={"caption"}>Rich Text:</Typography>
        <div dangerouslySetInnerHTML={{ __html: data.richText }} />
      </Box>
      <SchemaView schema={schema} />
    </Box>
  )
}
