import React, {createRef, useState} from "react";
import {Box, Button, Container, Grid, Paper, Tab, Tabs} from "@material-ui/core";
import SchemaBlocks from "./SchemaBlocks";

export default function LanguageWrapper({ data, schemas, onSave, onPreview, onDelete }) {

  const [tabValue, setTabValue] = useState(0);


  const languages = [
    { value: "de", name: "Deutsch", ref: createRef() },
    { value: "en", name: "English", ref: createRef() }
  ];

  function handleSave() {
    const data = languages.map(language => {
      return {
        lang: language.value,
        blocks: language.ref.current.getData()
      }
    });
    onSave(data);
  }

  function handlePreview() {
    const data = languages.map(language => {
      return {
        language: language.value,
        blocks: language.ref.current.getData()
      }
    });
    onPreview(data);
  }

  function handleDelete() {
    onDelete(data);
  }

  return (
    <Container>
      <Box mt={4} mb={4}>
        <Paper>
          <Tabs
            value={tabValue}
            onChange={(event, newValue) => setTabValue(newValue)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            {languages.map((language, i) => <Tab key={'tab' + i} label={language.name}/>)}
          </Tabs>
        </Paper>
      </Box>
      <Box mt={4} mb={4}>
        {languages.map((language, i) => {
          const blockData = data?.find(d => d.lang === language.value);
          return (
            <Box key={'schemaBlock' + i} sx={{display: tabValue === i ? 'block' : 'none'}}>
              <SchemaBlocks loadExternal={true} schemas={schemas} data={blockData} ref={language.ref}/>
            </Box>
          )
        })}
      </Box>
      <Box mt={2}>
        <Grid spacing={2} container>
          {onSave &&
            <Grid item>
              <Button variant={"contained"} color={"primary"} onClick={handleSave}>Save</Button>
            </Grid>
          }
          {onPreview &&
            <Grid item>
              <Button variant={"outlined"} color={"primary"} onClick={handlePreview}>Preview</Button>
            </Grid>
          }
          {onDelete &&
            <Grid item>
              <Button variant={"contained"} color={"secondary"} onClick={handleDelete}>Delete</Button>
            </Grid>
          }
        </Grid>
      </Box>
    </Container>
  )
}