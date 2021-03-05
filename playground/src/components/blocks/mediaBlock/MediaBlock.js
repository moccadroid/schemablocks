import schema from './MediaBlock.schema.json';
import SchemaView from "../../ui/SchemaView";
import {Box, Grid} from "@material-ui/core";
import {Media} from 'schemablocks';

export default function MediaBlock({ block }) {

  const { data } = block;

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item>
          <Box sx={{ maxWidth: 150}}>
            <Media data={data.singleImage} />
          </Box>
        </Grid>
      </Grid>
      <Box mt={2}/>
      <Grid container spacing={2}>
        {data.multipleImages.map((image, i) => {
          return (
            <Grid item key={'multi-' + i}>
              <Box sx={{ maxWidth: 150}}>
                <Media data={image} key={'image' + i}/>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <SchemaView schema={schema} />
    </div>
  )
}
