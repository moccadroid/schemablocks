# schemablocks
Generate a React backend interface for firebase/firestore based on [JSON schema](http://json-schema.org/).

## Disclaimer
You shouldn't use this library yet. It's still under heavy development and mainly meant for internal use ;)

## Installation
```sh
npm install --save schemablocks
```

## Usage

```javascript
import {useSchemaBlocksData, setFirebase, LanguageWrapper} from "schemablocks";
import firebase from './firebase.config';

const schemas = [
  {
    name: "Quote",
    schema: {
      "id": "quote",
      "type": "object",
      "properties": {
        "quote": {
          "type": "string",
          "controls": {
            "name": "Quote"
          }
        }
      }
    },
    block: ({block}) => {
      const {data} = block;
      return (
        <h1>{data.quote}</h1>
      )
    }
  }
]

export default function View() {

  setFirebase(firebase);
  const [data, saveData, deleteData] = useSchemaBlocksData({
    collection: 'schemablocks',
    slug: 'demo'
  });

  return (
    <LanguageWrapper 
      schemas={schemas} 
      data={data} 
      onSave={saveData} 
      onDelete={deleteData}
    />
  )
}
```

## ControlType Injection
You can inject your own input elements to be used in the backend interface.

```javascript
import {addControlInput} from "schemablocks";
import RichTextInput from "./RichTextInput";

export default function View() {
  addControlInput("richText", RichTextInput);
  
  return (
    ...
  )
}
```
You can then use the new Input as a type in your schema:
```json
{
  "richText": {
    "type": "string",
    "controls": {
      "name": "Rich Text Input",
      "type": "richText"
    }
  }
}
```
Every injected Component can expect the following props:
```javascript
{
  onChange: (value) => {}, // sets the components value in the parent SchemaBlock
  controls, // corresponds to the schema field "controls"
  error, // the possible error returned by jsonSchema validation
  defaultValue, // either the defaultValue from the schema, or the value from loaded data
  extData, // externally loaded data (undocumented still)
  id // the id of the inputBlock as uuidv4
}
```
Go see [RichTextInput](https://github.com/moccadroid/schemablocks/tree/master/playground/src/components/inputs) for an
example in action.

## Media Library
The media library is still quite experimental and the code is very specific to our current setup.
It uses Firebase Storage and Fireabase Functions to store and resize the Images. The code for the necessary Firebase function
will be released soon (when I figure out how to do this properly here).
To enable Media Library the following setup is necessary:

```javascript
import {setMediaLibraryConfig} from 'schemablocks';

export default function View() {
  setMediaLibraryConfig({
    firestoreCollection: 'mediaLibrary',
    imageMagicUrl: '<URL TO A FIREBASE FUNCTION THAT RESIZES LIBRARY IMAGES>',
  });
  
  return (
    ...
  )
}
```
To use it, you can use the following controls:
```json
{
  "images": {
    "type": "object",
    "controls": {
      "type": "image",
      "name": "Single Image",
      "noEdit": true,
      "defaultValue": "",
      "multiSelect": false
    },
    "properties": {
      "url": { "type": "string" },
      "id": { "type": "string" },
      "alt": { "type": "string" },
      "mimeType": { "type": "string" }
    }
  }
}
```
Go check out the [mediaBlock](https://github.com/moccadroid/schemablocks/tree/master/playground/src/components/blocks/mediaBlock) 
in the [Playground](#Playground) to find out more.

## Playground
Run the playground examples to see schemablocks in action

### Installation
Clone this repo and run
```sh
npm run i-all && npm run dev 
```