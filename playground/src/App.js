import 'react-quill/dist/quill.snow.css';
import RichTextInput from "./components/inputs/RichTextInput";
import {AppContainer, addControlInput, setConfiguration } from "schemablocks";
import schemas from "./schemas";
import configuration from "./schemablocks.config";
import Demo from "./components/pages/Demo";

function App() {
  addControlInput("richText", RichTextInput);
  setConfiguration(configuration);

  const collections = [
    {
      name: "DemoBlocks",
      value: "demoBlocks",
      schemas: schemas,
      publish: true
    }
  ];

  const routes = [
    { name: "Demo", path: "/demo", component: Demo }
  ];

  return (
    <div>
      <AppContainer routes={routes} collections={collections} login={"email"} pathPrefix={"/admin"}/>
    </div>
  )
}

export default App;
