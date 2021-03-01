import {LanguageWrapper, setMediaLibraryConfig, setFirebase, useSchemaBlocksData} from "schemablocks";
import firebase from "./firebase.config";
import QuoteBlock from "./components/QuoteBlock";

export default function Main() {

  setFirebase(firebase);
  setMediaLibraryConfig({
    imageMagicUrl: 'https://us-central1-vonkoeck-dev.cloudfunctions.net/imageMagic',
  })
  const [data, saveData] = useSchemaBlocksData({ collection: "schemablocks", slug: "test" });

  const blocks = [
    {
      name: "QuoteBlock",
      schema: {
        "id": "QuoteBlock",
        "type": "object",
        "properties": {
          "quote": {  "type": "string", "controls": { "name": "Quote" } },
          "image": {
            "id": "Image",
            "type": "object",
            "controls": { "type": "image", "name": "Image" },
            "properties": {
              "url": { "type": "string" },
              "id": { "type": "string" },
              "alt": { "type": "string" },
              "mimeType": { "type": "string" }
            }
          },
          "text": { "type": "string", "controls": { "type": "richText" }}
        }
      },
      block: QuoteBlock
    }
  ];

  return (
    <LanguageWrapper data={data} schemas={blocks} onSave={saveData}/>
  );
}
