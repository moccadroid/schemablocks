import {Box, Typography} from "@material-ui/core";

export default function ElementsBlock({ block }) {

  const { data } = block;

  return (
    <Box mt={4}>
      <Box mb={4}>
        <Typography variant={"caption"}>Boolean</Typography>
        <Typography>{(data.booleanValue + "").toUpperCase()}</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant={"caption"}>Enum Select</Typography>
        <div style={{ width: 50, height: 50, backgroundColor: data.color }}/>
      </Box>
    </Box>
  )
}