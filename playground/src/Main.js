import {LanguageWrapper, setMediaLibraryConfig, setFirebase, useSchemaBlocksData} from "schemablocks";
import firebase from "./firebase.config";
import schemas from "./schemas";

export default function Main() {

  setFirebase(firebase);
  setMediaLibraryConfig({
    imageMagicUrl: 'https://us-central1-vonkoeck-dev.cloudfunctions.net/imageMagic',
    firestoreCollection: 'mediaLibrary'
  });

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
