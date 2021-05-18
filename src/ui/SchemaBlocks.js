import {
  Alert,
  Box,
  Button, Checkbox, FormControlLabel,
  Grid, Snackbar,
} from "@material-ui/core";
import uuidv4 from "../lib/uuidv4";
import React, {createRef, forwardRef, useEffect, useImperativeHandle, useState} from "react";
import fromFirestore from "../provider/firestore";
import SelectInput from "./input/SelectInput";
import BlockList from "./BlockList";
import {getConfiguration} from "../lib/configuration";

const providers = {
  "firestore": fromFirestore
}

function SchemaBlocks({ schemas = [], data, loadExternal = false, noEdit = false, lang }, ref) {

  if (!schemas.length) {
    console.warn("Schemas empty! Please add at last a single schema.");
    return false;
  }
  const configuration = getConfiguration();

  const [copyOptions, setCopyOptions] = useState([]);
  const [copyData, setCopyData] = useState(null);
  const [selectedCopyOption, setSelectedCopyOption] = useState(null);
  const [addToAll, setAddToAll] = useState(true);
  const [schemaBlocks, setSchemaBlocks] = useState([]);
  const [externalData, setExternalData] = useState([]);
  const [schemaBlocksCreated, setSchemaBlocksCreated] = useState(false);
  const [schemaOptions, setSchemaOptions] = useState([]);
  const [selectedSchemaOption, setSelectedSchemaOption] = useState("");
  const [warningSnackbar, setWarningSnackbar] = useState(null);

  useImperativeHandle(ref, () => ({
    getData: () => getFormData(),
    isValid: () => schemaBlocks.every(block => block.ref.current?.isValid())
  }));

  const loadExternalData = async () => {
    // filter out all schemas that have external sources
    const schemasWithExternalSources = schemas.map(schema => {
      const sources = Object.entries(schema.schema.properties)
        .filter(([key, value]) => !!value?.controls?.source)
        .map(([key, value]) => ({ ...value, field: key }));

      if (sources.length) {
        return { id: schema.schema.id, sources }
      }
      return false;
    }).filter(schema => schema);

    // retrieve data from said sources
    const externalData = await Promise.all(schemasWithExternalSources.map(async schema => {
      const result = await Promise.all(schema.sources.map(async source => {

        const provider = providers[source.controls.source.type];
        const response = await provider(source.controls.source.query);

        const data = response.map(doc => {
          return Object.entries(source.controls.source.mapping).map(([key, value]) => {
            return {[key]: doc[value]}
          }).reduce((acc, cur) => ({...acc, ...cur}));

        });
        return { [source.field]: data };
      }));
      return { id: schema.id, data: result };
    }));

    setExternalData(externalData);
  };

  useEffect(() => {
    // map externalData to schemablocks
    setSchemaBlocks(schemaBlocks => {
      return schemaBlocks.map(block => {
        const id = block.schema.schema.id;
        const data = externalData.find(data => data.id === id);
        return {...block, externalData: data?.data};
      });
    });
  }, [externalData]);

  useEffect(() => {
    if (schemaBlocksCreated && loadExternal) {
      loadExternalData();
    }
  }, [schemaBlocksCreated]);

  useEffect(() => {
    const blocks = createSchemaBlocksFromData(data);
    setSchemaBlocks(blocks);
    setSchemaBlocksCreated(true);
  }, [data]);

  useEffect(() => {
    const schemaOptions = schemas.map(s => ({ name: s.name, value: s.name }));
    setSchemaOptions(schemaOptions);
    setSelectedSchemaOption(schemaOptions[0].name);

    loadCopyOptions();
  }, []);

  const createSchemaBlock = (schema, index, data = {}) => {
    const extData = externalData.find(ex => ex.id === schema.schema.id);
    return {
      index,
      ref: createRef(),
      schema,
      data,
      id: 'id' + uuidv4(),
      externalData: extData?.data
    }
  }

  const createSchemaBlocksFromData = (data) => {
    let blocks = [];
    if (data && data.blocks) {
      blocks = data.blocks.map((block, i) => {
        const schema = schemas.find(schemaData => schemaData.schema.id === block.id);
        if (schema) {
          return createSchemaBlock(schema, i, block.data);
        }
        return false;
      }).filter(block => block);
    }
    return blocks;
  }

  const removeSchemaBlock = (id) => {
    setSchemaBlocks(schemaBlocks => {
      return schemaBlocks.filter(block => block.id !== id);
    });
  }

  const addSchemaBlock = () => {
    if (selectedSchemaOption !== "") {
      const schema = schemas.find(s => s.name === selectedSchemaOption);
      const max = schema.schema.controls?.max;
      if (max) {
        const blocks = schemaBlocks.filter(block => block.schema.name === schema.name);
        if (blocks.length >= max) {
          setWarningSnackbar(`You can only use ${max} of these blocks here`);
        }
      } else {
        setSchemaBlocks(schemaBlocks => [...schemaBlocks, createSchemaBlock(schema, schemaBlocks.length)]);
      }
    }
  }

  const selectSchemaOption = (option) => {
    setSelectedSchemaOption(option);
  }

  const loadCopyOptions = async () => {
    if (configuration.copyCollection) {
      const query = { ...configuration.copyCollection, lang };
      const slugs = await fromFirestore(query);
      const slug = slugs.find(s => s.lang === lang);
      if (slug) {
        setCopyData(slug);
        const options = slug.blocks.map(block => ({ value: block.id, name: block.id}));
        setCopyOptions(() => options);
        setSelectedCopyOption(options[0]?.value);
      }
    }
  }

  const selectBlockToCopy = (option) => {
    console.log(option);
    setSelectedCopyOption(option);
  }

  const handleCopyBlock = () => {
    const schema = schemas.find(schemaData => schemaData.schema.id === selectedCopyOption);
    if (schema) {
      const copyBlock = copyData.blocks.find(b => b.id === selectedCopyOption);
      const block = createSchemaBlock(schema, schemaBlocks.length, copyBlock.data);
      setSchemaBlocks(blocks => [...blocks, block]);
    }
  }

  const getFormData = () => {
    return schemaBlocks.map(block => {
      const data = block.ref.current.getData();
      return {
        id: block.schema.schema.id,
        data
      }
    });
  };

  function handleOrderChange(list) {
    setSchemaBlocks(list);
  }

  function handleAddToAll(event) {
    setAddToAll(event.target.checked);
  }

  return (
    <Box>
      <BlockList noEdit={noEdit} blocks={schemaBlocks} onRemove={removeSchemaBlock} onOrderChange={handleOrderChange} />
      <Grid spacing={2} container direction="row" mt={2} alignItems="center" sx={{ justifyContent: "flex-end"}}>
        {copyOptions.length > 0 &&
          <>
            <Grid item>
              <SelectInput
                options={copyOptions}
                onChange={selectBlockToCopy}
                defaultValue={selectedCopyOption}
                controls={{name: ""}}
              />
            </Grid>
              <Grid item>
              <Button variant={"contained"} onClick={handleCopyBlock} disabled={noEdit}>Copy Block</Button>
            </Grid>
          </>
        }
        <Grid item>
          <SelectInput
            options={schemaOptions}
            onChange={selectSchemaOption}
            defaultValue={selectedSchemaOption}
            controls={{name: ""}}
          />
        </Grid>
        <Grid item>
          <Button variant={"contained"} onClick={addSchemaBlock} disabled={noEdit}>Add New Block</Button>
        </Grid>
      </Grid>
      {/*
      <Grid container direction="row" alignItems="center" sx={{ justifyContent: "flex-end"}}>
        <Grid item>
          <FormControlLabel labelPlacement="start" control={
            <Checkbox defaultChecked onChange={handleAddToAll}/>
          } label="Add to all languages" />
        </Grid>
      </Grid>
      */}
      <Snackbar open={!!warningSnackbar} autoHideDuration={6000} onClose={() => setWarningSnackbar(null)}>
        <Alert onClose={() => setWarningSnackbar(null)} severity="warning" variant="filled">
          {warningSnackbar}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default forwardRef(SchemaBlocks);
