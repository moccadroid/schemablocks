import {LanguageWrapper, setFirebase, useSchemaBlocksData} from "schemablocks";
import firebase from "./firebase.config";
import QuoteBlock from "./components/QuoteBlock";

export default function Main() {

  setFirebase(firebase);
  const [data, saveData] = useSchemaBlocksData({ collection: "schemablocks", slug: "test" });

  const blocks = [
    {
      name: "QuoteBlock",
      schema: {
        "id": "QuoteBlock",
        "type": "object",
        "properties": {
          "quote": {  "type": "string", "controls": { "name": "Quote" } }
        }
      },
      block: QuoteBlock
    }
  ];

  return (
    <LanguageWrapper data={data} schemas={blocks} onSave={saveData}/>
  );
}
