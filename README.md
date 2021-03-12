# schemablocks
Generate a React backend interface for firebase/firestore based on [JSON schema](http://json-schema.org/).

## Disclaimer
You shouldn't use this library yet. It's still under heavy development and mainly meant for internal use ;)

## Installation
```sh
npm install --save schemablocks
```

## Usage
Schemablocks is meant to be used by the person building and maintaning the frontend. 
"frontend" in this case describes the actual graphical part of the website.
Whereas "backend" is the admin interface used to enter and edit data.
By creating schemas for the data the frontend uses, schemablocks allows the frontend developer to automatically generate 
complex admin interfaces e.g. the backend without any extra code. 

## Frontend Usage
Every schemablocks project starts by building a frontend block with the accompanying schema.

### QuoteBlock
Here we use a simple QuoteBlock. For the sake of brevity we omit all stylings.
Documentation for all the properties you can use in the schema can be found [here](#).
```javascript
export default function QuoteBlock({ block }) {
  const {data} = block;
  return (
    <div>
      <h2>{data.quote}</h2>
    </div>
  )
}

export const QuoteBlockSchema = {
  "id": "quote",
  "type": "object",
  "properties": {
    "quote": {
      "type": "string",
      "controls": { "name": "Quote" }
    }
  }
}
```

### ContenBlocks
ContentBlocks is a little helper (currently not part of schemablocks) that makes it easy to use your data with the blocks you created
```javascript
import QuoteBlock from "./QuoteBlock";
export default function ContentBlocks({ data }) {
  const blocks = {
    "QuoteBlock": QuoteBlock
  };
  
  const resolve = (data) => {
    return data?.blocks?.map((block, i) => {
      const Component = blocks[block.id];
      if (Component) {
        return <Component block={block} key={"block" + i} />
      }
      return false;
    })
  };
  
  return <div>{resolve(data)}</div>
}
```

### Index
Using [next.js](https://nextjs.org/) and Firebase SDK we can write a page that loads this data and uses ContentBlocks to select and display it.
```javascript
import ContentBlocks from "./ContentBlocks";
export default function Index({ data }) {

  return <ContentBlocks blocks={data.blocks} />
}

export async function getServerSideProps() {
  const snapshot = await firebase.firestore().collection("schemablocks")
    .where("slug", "==", "index")
    .where("lang", "==", "en");
  const data = {};
  snapshot.forEach(doc => data = doc.data());
  return { props: { data }}
}
```

## Backend Usage
Also using [next.js](https://nextjs.org/) we create pages/admin.js and wire everything together:
```javascript
import {useSchemaBlocksData, setFirebase, Panel} from "schemablocks";
import firebase from "./firebase.config";
import QuoteBlock, {QuoteBlockSchema} from "./Quoteblock"

const schemas = [{
  name: "Quote",
  schema: QuoteBlockSchema,
  block: QuoteBlock
}];

export default function Admin() {
  setFirebase(firebase);
  const [data, saveData, deleteData] = useSchemaBlocksData({
    collection: 'schemablocks',
    slug: 'demo'
  });

  const slugs = [{ name: "Index", collection: "schemablocks", slug: "index", schemas }]
  
  return <Panel slugs={slugs} />
}
```
That's it!
To add more blocks to your page (and the backend), don't forget to register them in the schemas array above 
and also register it in the ContentBlocks object so it will be found and displayed.

## Advanced schemablocks concepts

### ControlType Injection
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
  id, // the id of the inputBlock as uuidv4,
  type //either the controls.type or (if missing) the jsonschema type
}
```
Go see [RichTextInput](https://github.com/moccadroid/schemablocks/tree/master/playground/src/components/inputs) for an
example in action.

### Media Library
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
      "multiSelect": false
    },
    "properties": "#MediaProperties"
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

## Schema Documentation
coming soon...
