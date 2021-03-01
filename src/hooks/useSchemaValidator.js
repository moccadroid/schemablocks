import { useState } from 'react';
import { Validator } from 'jsonschema';

export default function useSchemaValidator() {

  const [validator, setValidator] = useState(new Validator());

  return validator;
};
