import {
  setMediaLibraryConfig,
  setFirebase,
  useSchemaBlocksData,
  addControlInput,
  useSchemas, Slug, Panel
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
    { name: "Demo1", collection: "demoBlocks", slug: "demoBlocks1", schemas: schemas },
    { name: "Demo2", collection: "demoBlocks", slug: "demoBlocks2", schemas: schemas },
    { name: "Demo3", collection: "demoBlocks", slug: "demoBlocks3", schemas: schemas }
  ]

  return (
    <div>
      <Panel slugs={slugs} />
    </div>
  );
}
