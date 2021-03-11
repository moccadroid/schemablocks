import React, {createRef, useState} from "react";
import {Box, Button, Container, Grid, Paper, Tab, Tabs} from "@material-ui/core";
import SchemaBlocks from "./SchemaBlocks";

export default function LanguageWrapper({ data, schemas, languages = [] }) {

  const [tabValue, setTabValue] = useState(0);

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

    </Container>
  )
}
