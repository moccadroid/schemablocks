import {Alert, Box, Button, Grid, Typography} from "@material-ui/core";
import useSchemaValidator from "../hooks/useSchemaValidator";
import React, {createRef, forwardRef, useEffect, useImperativeHandle, useState} from "react";
import SelectInput from "./input/SelectInput";
import MediaInput from "./input/MediaInput";
import RichTextInput from "./input/RichTextInput";
import TextInput from "./input/TextInput";
import SwitchInput from "./input/SwitchInput";
import SchemaBlocks from "./SchemaBlocks";
import LinkInput from "./input/LinkInput";

function SchemaBlock({ block, onRemove }, ref) {

  const { schema, data, externalData } = block;
  const validator = useSchemaValidator();
  const [inputBlock, setInputBlock] = useState(createInputBlock());
  const [inputState, setInputState] = useState(data);
  const [preview, setPreview] = useState(false);

  useImperativeHandle(ref, () => ({
    getData: () => getFormData(),
    isValid: () => {
      const errors = validate().errors;
      if (errors.length) {
        console.log(errors);
      }
      return errors.length === 0 },
  }));

  useEffect(() => {
    setInputBlock(createInputBlock());
  }, [schema]);

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

  const validate = () => {
    const result = validator.validate(inputState, schema);
    if (result.errors.length > 0) {
      console.log(result.errors);
    }
    return {...inputState, errors: result.errors };
  }

  const createInputs = () => {
    const { schema: { schema }, id, errors } = inputBlock;

    if (schema.controls) {
      if(schema.controls.propertyGroup) {
        //console.log(schema.controls.propertyGroup);
      }
    }

    return Object.entries(schema.properties).map(([key, value]) => {

      const { type, controls, ...rest } = value;
      if (!controls) { return }

      const inputError = errors.find(error => error.path.includes(key));
      let defaultValue = inputBlock.data[key];

      const extData = externalData?.find(data => data[key])?.[key];

      const propDefaults = {
        onChange: (value) => onChange(value, key),
        controls,
        error: inputError,
        defaultValue,
        extData
      };

      const controlStyle = controls.styles ?? {};

      let element = false;

      if (controls.type === "link") {
        element = <LinkInput {...propDefaults} />;
      } else if (type === "array" && controls.type === "schemablocks") {
        const schemas = value.items.map(item => ({ name: item.id, schema: item }));
        const ref = inputBlock.refs.find(ref => ref.key === key)?.ref;
        defaultValue = { blocks: defaultValue }

        element = (
          <Box mt={1} mb={1}>
            <Typography>{controls.name}</Typography>
            <SchemaBlocks schemas={schemas} data={defaultValue} ref={ref}/>
          </Box>
        );
      }
      else if (controls.type === "image" && type === "object") {
        element = <MediaInput {...propDefaults} />
      }
      else if (controls.type === "select") {
        const options = controls.enum || extData || [];
        element = <SelectInput {...propDefaults} options={options} id={id} />
      }
      else if (controls.type === "richText" && type === "string") {
        element = <RichTextInput {...propDefaults} />
      }
      else if (type === "string" || type === "number") {
        element = <TextInput type={type} {...propDefaults} />
      }
      else if (type === "boolean") {
        propDefaults["defaultValue"] = typeof defaultValue === 'undefined' ? true : defaultValue;
        element = <SwitchInput {...propDefaults} />
      }

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

  const onChange = (value, key) => {
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
    return <Component block={block}/>
  };

  return (
    <Box>
      { createInputs() }
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
          <Button variant={"outlined"} color={"secondary"} onClick={onRemove}>Remove</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default forwardRef(SchemaBlock);
