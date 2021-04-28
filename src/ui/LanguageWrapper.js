import React, {useState} from "react";
import {Box, Container, Paper, Tab, Tabs} from "@material-ui/core";
import SchemaBlocks from "./SchemaBlocks";

export default function LanguageWrapper({ data, schemas, languages = [], noEdit = false, onChange }) {

  const [tabValue, setTabValue] = useState(0);

  function handleOnChange(event, newValue) {
    setTabValue(newValue);
    if (onChange) {
      onChange(languages[newValue]);
    }
  }

  return (
    <Container>
      <Box mt={2} mb={2}>
        <Paper>
          <Tabs
            value={tabValue}
            onChange={handleOnChange}
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
              <SchemaBlocks lang={language.value} noEdit={noEdit} loadExternal={true} schemas={schemas} data={blockData} ref={language.ref}/>
            </Box>
          )
        })}
      </Box>

    </Container>
  )
}
