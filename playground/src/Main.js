import {
  setMediaLibraryConfig,
  setFirebase,
  addControlInput,
  Panel
} from "schemablocks";
import firebase from "./firebase.config";
import schemas from "./schemas";
import jsonData from './data.json';
import RichTextInput from "./components/inputs/RichTextInput";

export default function Main() {

  setFirebase(firebase);
  setMediaLibraryConfig({
    firestoreCollection: 'mediaLibrary',
    imageMagicUrl: process.env.REACT_APP_IMAGE_MAGIC_URL,
  });
  addControlInput("richText", RichTextInput);

  const slugs = [
    { name: "Demo1", collection: "demoBlocks", slug: "demoBlocks1", schemas: schemas }
  ]

  return (
    <div>
      <Panel slugs={slugs} />
    </div>
  );
}
