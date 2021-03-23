import 'react-quill/dist/quill.snow.css';
import firebase from "./firebase.config";
import RichTextInput from "./components/inputs/RichTextInput";
import {AppContainer, setFirebase, addControlInput, setMediaLibraryConfig} from "schemablocks";
import schemas from "./schemas";

function App() {

  setFirebase(firebase);
  setMediaLibraryConfig({
    firestoreCollection: 'mediaLibrary',
    imageMagicUrl: process.env.REACT_APP_IMAGE_MAGIC_URL,
  });
  addControlInput("richText", RichTextInput);

  const collections = [
    {
      name: "DemoBlocks",
      value: "demoBlocks",
      schemas: schemas
    },
    {
      name: "SchemaBlocks",
      value: "schemablocks",
      schemas: schemas
    }
  ];

  const routes = [

  ];

  return (
    <AppContainer routes={routes} collections={collections} login={"email"} />
  )
}

export default App;
