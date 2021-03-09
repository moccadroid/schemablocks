import {LanguageWrapper, setMediaLibraryConfig, setFirebase, useSchemaBlocksData} from "schemablocks";
import firebase from "./firebase.config";
import schemas from "./schemas";
import jsonData from './data.json';
import {addControlInput} from "schemablocks";
import RichTextInput from "./components/inputs/RichTextInput";

export default function Main() {

  setFirebase(firebase);
  setMediaLibraryConfig({
    firestoreCollection: 'mediaLibrary',
    imageMagicUrl: process.env.REACT_APP_IMAGE_MAGIC_URL,
  });
  addControlInput("richText", RichTextInput);

  const [data, saveData] = useSchemaBlocksData({ collection: "demoBlocks", slug: "demoBlocks" });

  function save(data) {
    console.log(data);
    saveData(data);
  }

  return (
    <div>
      <LanguageWrapper data={data} schemas={schemas} onSave={save}/>
    </div>
  );
}
