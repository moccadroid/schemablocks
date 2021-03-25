import {Alert, Box, Button, Grid, Typography} from "@material-ui/core";
import useSchemaValidator from "../hooks/useSchemaValidator";
import React, {createRef, forwardRef, useEffect, useImperativeHandle, useState} from "react";
import TextInput from "./input/TextInput";
import SwitchInput from "./input/SwitchInput";
import SchemaBlocks from "./SchemaBlocks";
import {getControlInputForType} from "../lib/controlInputs";
import useDefaultData from "../hooks/useDefaultData";

function SchemaBlock({ block, onRemove, noEdit = false }, ref) {

  const { schema, data: dbData, externalData } = block;

  const data = useDefaultData(dbData, schema);

  const validator = useSchemaValidator();
  const [inputBlock, setInputBlock] = useState(createInputBlock());
  const [inputState, setInputState] = useState(data);
  const [shouldValidate, setShouldValidate] = useState(false);
  const [inputs, setInputs] = useState([])
  const [preview, setPreview] = useState(false);
  const [disabled, setDisabled] = useState(noEdit);

  useImperativeHandle(ref, () => ({
    getData: () => getFormData(),
    isValid: () => {
      return inputBlock.errors.length === 0
    }
  }));

  useEffect(() => {
    if (noEdit !== disabled) {
      const inputBlock = createInputBlock();
      const inputs = createInputs(inputBlock);
      setInputBlock(inputBlock);
      setInputs(inputs);
    }
    setDisabled(noEdit);
    // validate();
  }, [schema, noEdit]);

  useEffect(() => {
    setInputs(createInputs(inputBlock));
  }, [inputBlock]);

  useEffect(() => {
    if (shouldValidate) {
      validate();
    }
  }, [shouldValidate]);

  function createInputBlock() {
    // create refs for schemablocks
    const refs = Object.entries(schema.schema.properties).map(([key, value]) => {
      const { controls } = value;
      if (controls?.type === 'schemablocks') {
        return { ref: createRef(), key };
      }
      return false;
    }).filter(val => val);

    return {
      id: block.id,
      schema: schema,
      data: data,
      errors: [],
      refs,
    };
  }

  const getFormData = () => {
    inputBlock.refs.forEach(ref => {
      const data = ref.ref.current.getData();
      if (data) {
        inputState[ref.key] = data;
      }
    });
    return inputState;
  }

  function validate () {
    const result = validator.validate(inputState, schema.schema);
    if (result.errors.length > 0) {
      //console.error("validation errors:", result.errors);
    }
    setInputBlock(inputBlock => ({...inputBlock, errors: result.errors}));
  }

  const createInputs = () => {
    const { schema: { schema }, id, errors } = inputBlock;

    return Object.entries(schema.properties).map(([key, value]) => {

      const { type, controls, ...rest } = value;
      if (!controls) { return }

      const inputError = inputBlock.errors.find(error => error.path.includes(key));
      let defaultValue = inputBlock.data[key] || controls.defaultValue;

      if (typeof inputState[key] === "undefined") {
        setInputValue(defaultValue, key);
      }

      const extData = externalData?.find(data => data[key])?.[key];

      const propDefaults = {
        onChange: (value) => setInputValue(value, key),
        onBlur: () => setShouldValidate(true),
        controls,
        error: inputError,
        defaultValue,
        extData,
        type: controls.type || type,
        id,
        disabled: noEdit
      };

      // use onboard or injected control inputs:
      let element = getControlInputForType(controls.type, propDefaults);

      if (!element) {
        if (type === "array" && controls.type === "schemablocks") {
          const schemas = value.items.map(item => ({name: item.id, schema: item}));
          const ref = inputBlock.refs.find(ref => ref.key === key)?.ref;
          defaultValue = {blocks: defaultValue}

          element = (
            <Box mt={1} mb={1}>
              <Typography>{controls.name}</Typography>
              <SchemaBlocks schemas={schemas} data={defaultValue} ref={ref} noEdit={noEdit}/>
            </Box>
          );
        } else if (type === "string" || type === "number") {
          element = <TextInput {...propDefaults} />
        } else if (type === "boolean") {
          element = <SwitchInput {...propDefaults} />
        }
      }

      const controlStyle = controls.styles ?? {};
      return (
        <Box key={id + key} style={controlStyle}>
          {controls.hint &&
            <Box mb={1} mt={1}>
              <Alert severity={"info"}>{controls.hint}</Alert>
            </Box>
          }
          {controls.alert &&
            <Box mb={1} mt={1}>
              <Alert severity={"error"}>{controls.alert}</Alert>
            </Box>
          }
          {element}
        </Box>
      );

    });
  }

  const setInputValue = (value, key) => {
    if (noEdit) {
      return
    }

    setInputState(inputState => {
      return {
        ...inputState,
        [key]: value,
      };
    });
  }

  const createPreview = () => {
    const Component = schema.block;
    const block = {id: schema.schema.id, data: inputState}
    return (
      <Box sx={{ marginTop: 1}}>
        <Typography variant={"button"}>Preview:</Typography>
        <Box sx={{ border: "1px solid #ccc", padding: 2 }}>
          <Component block={block}/>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      { inputs }
      {schema.block &&
        <Box>
          {preview && createPreview()}
        </Box>
      }
      <Grid spacing={2} container mt={2}>
        {schema.block &&
          <Grid item>
            <Button variant={"outlined"} onClick={() => setPreview(preview => !preview)}>Preview</Button>
          </Grid>
        }
        <Grid item>
          <Button disabled={noEdit} variant={"outlined"} color={"secondary"} onClick={onRemove}>Remove</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default forwardRef(SchemaBlock);
