import {Box, Typography} from "@material-ui/core";
import schema from './ElementsBlock.schema.json';
import SchemaView from "../../ui/SchemaView";

export default function ElementsBlock({ block }) {

  const { data } = block;

  return (
    <Box>
      <Box mb={2}>
        <Typography variant={"caption"}>Boolean</Typography>
        <Typography>{(data.booleanValue + "").toUpperCase()}</Typography>
      </Box>
      <Box mb={2}>
        <Typography variant={"caption"}>Enum Select</Typography>
        <div style={{ width: 50, height: 50, backgroundColor: data.color }}/>
      </Box>
      <Box mb={2}>
        <a href={data.link.url} target={data.link.openInNew ? "_blank" : "_self"} rel="noopener noreferrer">{data.link.name}</a>
      </Box>
      <SchemaView schema={schema} />
    </Box>
  )
}
