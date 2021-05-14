import React, {useEffect, useState} from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs
} from "@material-ui/core";
import SchemaBlocks from "./SchemaBlocks";

export default function LanguageWrapper({ data, schemas, languages = [], noEdit = false, onChange }) {

  const [tabValue, setTabValue] = useState(0);
  const [slugData, setSlugData] = useState(data);

  useEffect(() => {
    setSlugData(data);
  }, [data])

  function handleOnChange(event, newValue) {
    setTabValue(newValue);
    if (onChange) {
      onChange(languages[newValue]);
    }
  }

  function handleCopyFromLanguage(language) {
    if (language !== "") {
      const blockData = data?.find(d => d.lang === language);
      const newData = slugData;
      newData.forEach(d => {
        if (d.lang === languages[tabValue].value) {
          d.blocks = blockData.blocks;
        }
      });
      setSlugData(newData);
      handleOnChange(null, tabValue);
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
          const blockData = slugData?.find(d => d.lang === language.value);
          return (
            <Box key={'schemaBlock' + i} sx={{display: tabValue === i ? 'block' : 'none'}}>
              {blockData?.blocks?.length === 0
                ? <CopyFromLanguage languages={languages} onClick={handleCopyFromLanguage} />
                : <SchemaBlocks lang={language.value}
                                noEdit={noEdit}
                                loadExternal={true}
                                schemas={schemas}
                                data={blockData}
                                ref={language.ref} />
              }
            </Box>
          )
        })}
      </Box>

    </Container>
  )
}

function CopyFromLanguage({ languages, onClick }) {
  const [copyFrom, setCopyFrom] = useState("");

  function handleChange(event) {
    setCopyFrom(event.target.value);
  }

  return (
    <Grid container spacing={2} alignItems="flex-end">
      <Grid item>
        <FormControl variant="standard" sx={{ width: 300 }}>
          <InputLabel>Copy From</InputLabel>
          <Select
            value={copyFrom}
            onChange={handleChange}
            label="Copy From"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {languages.map((lang, i) => {
              return <MenuItem value={lang.value} key={"lang" + i}>{lang.name}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <Button variant={"contained"} onClick={() => onClick(copyFrom)}>Copy</Button>
      </Grid>
    </Grid>
  )
}
