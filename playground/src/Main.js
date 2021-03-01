import {LanguageWrapper, setMediaLibraryConfig, setFirebase, useSchemaBlocksData} from "schemablocks";
import firebase from "./firebase.config";
import schemas from "./schemas";

export default function Main() {

  setFirebase(firebase);
  setMediaLibraryConfig({
    imageMagicUrl: 'https://us-central1-vonkoeck-dev.cloudfunctions.net/imageMagic',
  });

  const [data, saveData] = useSchemaBlocksData({ collection: "schemablocks", slug: "textBlocks" });

  return (
    <LanguageWrapper data={data} schemas={schemas} onSave={saveData}/>
  );
}
