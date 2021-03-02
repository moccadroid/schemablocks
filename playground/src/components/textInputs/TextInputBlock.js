import {Box, Typography} from "@material-ui/core";

export default function TextInputBlock({ block }) {

  const { data } = block;

  return (
    <Box mt={4}>
      <Box mb={4}>
        <Typography variant={"caption"}>Normal Text:</Typography>
        <Typography>{data.normalText}</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant={"caption"}>Max Length Text:</Typography>
        <Typography>{data.maxLengthText}</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant={"caption"}>Rich Text:</Typography>
        <div dangerouslySetInnerHTML={{ __html: data.richText }} />
      </Box>
    </Box>
  )
}