import 'react-quill/dist/quill.snow.css';
import RichTextInput from "./components/inputs/RichTextInput";
import {AppContainer, addControlInput, setConfiguration } from "schemablocks";
import schemas from "./schemas";
import configuration from "./schemablocks.config";

function App() {
  addControlInput("richText", RichTextInput);
  setConfiguration(configuration);

  const collections = [
    {
      name: "DemoBlocks",
      value: "demoBlocks",
      schemas: schemas
    }
  ];

  const routes = [

  ];

  return (
    <AppContainer routes={routes} collections={collections} login={"email"} pathPrefix={"/admin"}/>
  )
}

export default App;
