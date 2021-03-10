import {useState} from "react";
import definitions from "../schemas/definitions/index";
import fragments from "../schemas/fragments/index";

export default function useSchemas(schemas = []) {
  const [schemaList, setSchemaList] = useState(assembleSchemas(schemas));

  function assembleSchemas(schemas) {
    const inputSchemas = Array.isArray(schemas) ? schemas : [schemas];
    return inputSchemas.map(schema => {
      let schemaString = JSON.stringify(schema.schema);
      Object.entries(definitions).forEach(([key, value]) => {
        schemaString = schemaString.replaceAll(`"${key}"`, JSON.stringify(value));
      });
      Object.entries(fragments).forEach(([key, value]) => {
        schemaString = schemaString.replaceAll(`"${key}"`, JSON.stringify(value));
      })
      const schemaObject = JSON.parse(schemaString);

      return {
        name: schema.name ?? schema.schema.id,
        schema: schemaObject,
        block: schema.block ?? false
      }
    });
  }

  function addSchemas(schemas) {
    setSchemaList(schemaList => [...schemaList, ...assembleSchemas(schemas)]);
  }

  return [schemaList, addSchemas];
}
