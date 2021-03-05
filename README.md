# schemablocks
Generate a React backend interface for firebase/firestore based on [JSON schema](http://json-schema.org/).

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
